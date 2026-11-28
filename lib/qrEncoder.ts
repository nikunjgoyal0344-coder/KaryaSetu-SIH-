/**
 * Pure TypeScript ISO/IEC 18004 Byte-Mode QR Code Encoder (Versions 1-5, EC Level L).
 * Zero external runtime dependencies; produces scannable boolean module matrices.
 */

interface QrVersionSpec {
  version: number;
  size: number;
  dataCodewords: number;
  ecCodewords: number;
  alignmentCenters: readonly number[];
}

const QR_SPECS_L: readonly QrVersionSpec[] = [
  { version: 1, size: 21, dataCodewords: 19, ecCodewords: 7, alignmentCenters: [] },
  { version: 2, size: 25, dataCodewords: 34, ecCodewords: 10, alignmentCenters: [6, 18] },
  { version: 3, size: 29, dataCodewords: 55, ecCodewords: 15, alignmentCenters: [6, 22] },
  { version: 4, size: 33, dataCodewords: 80, ecCodewords: 20, alignmentCenters: [6, 26] },
  { version: 5, size: 37, dataCodewords: 108, ecCodewords: 26, alignmentCenters: [6, 30] },
];

// GF(256) log/exp lookup tables for primitive polynomial x^8 + x^4 + x^3 + x^2 + 1 (0x11d)
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_EXP[i + 255] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) {
      x ^= 0x11d;
    }
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function buildReedSolomonGenerator(ecCount: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < ecCount; i++) {
    const next = new Uint8Array(poly.length + 1);
    const factor = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], factor);
    }
    poly = next;
  }
  return poly;
}

function computeReedSolomonEc(data: Uint8Array, ecCount: number): Uint8Array {
  const gen = buildReedSolomonGenerator(ecCount);
  const work = new Uint8Array(data.length + ecCount);
  work.set(data, 0);

  for (let i = 0; i < data.length; i++) {
    const coef = work[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        work[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }

  return work.slice(data.length);
}

/**
 * Computes 15-bit BCH format word for EC Level L (01) and Mask 0..7.
 */
export function computeFormatBits(maskPattern: number): number {
  const ecLevelL = 0b01;
  const data = ((ecLevelL & 0b11) << 3) | (maskPattern & 0b111);
  let remainder = data << 10;
  const generator = 0x537;

  for (let bit = 14; bit >= 10; bit--) {
    if ((remainder >> bit) & 1) {
      remainder ^= generator << (bit - 10);
    }
  }

  return ((data << 10) | remainder) ^ 0x5412;
}

function encodeBytePayload(bytes: Uint8Array, spec: QrVersionSpec): Uint8Array {
  const bits: number[] = [];
  const pushBits = (value: number, width: number) => {
    for (let i = width - 1; i >= 0; i--) {
      bits.push((value >> i) & 1);
    }
  };

  // Mode: Byte (0100), Length: 8 bits for Versions 1..9
  pushBits(0b0100, 4);
  pushBits(bytes.length, 8);
  for (let i = 0; i < bytes.length; i++) {
    pushBits(bytes[i], 8);
  }

  const maxBits = spec.dataCodewords * 8;
  const terminatorLen = Math.min(4, maxBits - bits.length);
  pushBits(0, terminatorLen);

  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bits.length < maxBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx += 1;
  }

  const codewords = new Uint8Array(spec.dataCodewords);
  for (let i = 0; i < spec.dataCodewords; i++) {
    let val = 0;
    for (let b = 0; b < 8; b++) {
      val = (val << 1) | bits[i * 8 + b];
    }
    codewords[i] = val;
  }

  return codewords;
}

function createReservedAndFunctionGrid(spec: QrVersionSpec): {
  modules: boolean[][];
  reserved: boolean[][];
} {
  const { size, alignmentCenters } = spec;
  const modules = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
  const reserved = Array.from({ length: size }, () => Array<boolean>(size).fill(false));

  const placeFinderWithSeparator = (topRow: number, leftCol: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = topRow + r;
        const cc = leftCol + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        reserved[rr][cc] = true;
        const inOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const inInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        const inBox = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        modules[rr][cc] = inBox && (inOuter || inInner);
      }
    }
  };

  placeFinderWithSeparator(0, 0);
  placeFinderWithSeparator(0, size - 7);
  placeFinderWithSeparator(size - 7, 0);

  // Timing patterns along row 6 and col 6
  for (let i = 8; i < size - 8; i++) {
    const dark = i % 2 === 0;
    modules[6][i] = dark;
    reserved[6][i] = true;
    modules[i][6] = dark;
    reserved[i][6] = true;
  }

  // Alignment patterns for Version >= 2
  for (const cr of alignmentCenters) {
    for (const cc of alignmentCenters) {
      const overlapsTopLeft = cr === 6 && cc === 6;
      const overlapsTopRight = cr === 6 && cc === size - 7;
      const overlapsBottomLeft = cr === size - 7 && cc === 6;
      if (overlapsTopLeft || overlapsTopRight || overlapsBottomLeft) continue;

      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const rr = cr + dr;
          const cc2 = cc + dc;
          reserved[rr][cc2] = true;
          modules[rr][cc2] = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
        }
      }
    }
  }

  // Mandatory dark module
  modules[size - 8][8] = true;
  reserved[size - 8][8] = true;

  // Reserve format info coordinates around all three finders
  for (let i = 0; i < 9; i++) {
    if (i !== 6) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i++) {
    reserved[8][size - 1 - i] = true;
  }
  for (let i = 0; i < 7; i++) {
    reserved[size - 1 - i][8] = true;
  }

  return { modules, reserved };
}

function shouldFlipMask(mask: number, row: number, col: number): boolean {
  switch (mask) {
    case 0:
      return (row + col) % 2 === 0;
    case 1:
      return row % 2 === 0;
    case 2:
      return col % 3 === 0;
    case 3:
      return (row + col) % 3 === 0;
    case 4:
      return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
    case 5:
      return ((row * col) % 2) + ((row * col) % 3) === 0;
    case 6:
      return (((row * col) % 2) + ((row * col) % 3)) % 2 === 0;
    default:
      return (((row + col) % 2) + ((row * col) % 3)) % 2 === 0;
  }
}

function applyFormatInformation(modules: boolean[][], size: number, mask: number): void {
  const format = computeFormatBits(mask);

  for (let bitIdx = 0; bitIdx < 15; bitIdx++) {
    const bit = ((format >> bitIdx) & 1) === 1;

    // Copy 1: clockwise around top-left finder (bit 0 at (0,8) .. bit 14 at (8,0))
    if (bitIdx < 6) {
      modules[bitIdx][8] = bit;
    } else if (bitIdx === 6) {
      modules[7][8] = bit;
    } else if (bitIdx === 7) {
      modules[8][8] = bit;
    } else if (bitIdx === 8) {
      modules[8][7] = bit;
    } else {
      modules[8][14 - bitIdx] = bit;
    }

    // Copy 2: top-right strip (bits 0..7) and bottom-left strip (bits 8..14)
    if (bitIdx < 8) {
      modules[8][size - 1 - bitIdx] = bit;
    } else {
      modules[size - 15 + bitIdx][8] = bit;
    }
  }
}

function computeMaskPenalty(modules: boolean[][], size: number): number {
  let penalty = 0;

  // Rule 1: 5+ adjacent same-color modules in rows and columns
  for (let r = 0; r < size; r++) {
    let runRow = 1;
    let runCol = 1;
    for (let c = 1; c < size; c++) {
      if (modules[r][c] === modules[r][c - 1]) {
        runRow++;
      } else {
        if (runRow >= 5) penalty += 3 + (runRow - 5);
        runRow = 1;
      }
      if (modules[c][r] === modules[c - 1][r]) {
        runCol++;
      } else {
        if (runCol >= 5) penalty += 3 + (runCol - 5);
        runCol = 1;
      }
    }
    if (runRow >= 5) penalty += 3 + (runRow - 5);
    if (runCol >= 5) penalty += 3 + (runCol - 5);
  }

  // Rule 2: 2x2 solid blocks
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const val = modules[r][c];
      if (val === modules[r][c + 1] && val === modules[r + 1][c] && val === modules[r + 1][c + 1]) {
        penalty += 3;
      }
    }
  }

  // Rule 3: Balance proportion of dark modules
  let darkCount = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (modules[r][c]) darkCount++;
    }
  }
  const darkPct = (darkCount * 100) / (size * size);
  const k = Math.floor(Math.abs(darkPct - 50) / 5);
  penalty += k * 10;

  return penalty;
}

/**
 * Encodes a UTF-8 string into an ISO/IEC 18004 QR boolean matrix (Versions 1-5, EC Level L).
 */
export function generateQrMatrix(text: string): boolean[][] {
  const bytes = new TextEncoder().encode(text);
  const spec = QR_SPECS_L.find((s) => bytes.length <= s.dataCodewords - 2) ?? QR_SPECS_L[QR_SPECS_L.length - 1];
  const clampedBytes = bytes.slice(0, spec.dataCodewords - 2);

  const data = encodeBytePayload(clampedBytes, spec);
  const ec = computeReedSolomonEc(data, spec.ecCodewords);
  const fullStream = new Uint8Array(data.length + ec.length);
  fullStream.set(data, 0);
  fullStream.set(ec, data.length);

  const { modules: baseModules, reserved } = createReservedAndFunctionGrid(spec);
  const size = spec.size;

  // Place bitstream in upward/downward zigzag columns
  let bitIdx = 0;
  const totalBits = fullStream.length * 8;
  let upward = true;

  for (let rightCol = size - 1; rightCol >= 1; rightCol -= 2) {
    if (rightCol === 6) rightCol = 5;
    for (let step = 0; step < size; step++) {
      const r = upward ? size - 1 - step : step;
      for (const offset of [0, -1]) {
        const c = rightCol + offset;
        if (!reserved[r][c]) {
          const bit =
            bitIdx < totalBits
              ? ((fullStream[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1) === 1
              : false;
          baseModules[r][c] = bit;
          bitIdx++;
        }
      }
    }
    upward = !upward;
  }

  let bestMask = 0;
  let bestPenalty = Number.POSITIVE_INFINITY;
  let bestMatrix = baseModules;

  for (let mask = 0; mask < 8; mask++) {
    const candidate = baseModules.map((row, r) =>
      row.map((val, c) => (!reserved[r][c] && shouldFlipMask(mask, r, c) ? !val : val))
    );
    applyFormatInformation(candidate, size, mask);
    const penalty = computeMaskPenalty(candidate, size);
    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      bestMask = mask;
      bestMatrix = candidate;
    }
  }

  applyFormatInformation(bestMatrix, size, bestMask);
  return bestMatrix;
}
