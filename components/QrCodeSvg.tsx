'use client';

import React, { useMemo } from 'react';
import { generateQrMatrix } from '@/lib/qrEncoder';

interface QrCodeSvgProps {
  value: string;
  size?: number;
  label?: string;
  className?: string;
}

/**
 * Renders a crisp, scannable ISO/IEC 18004 QR code SVG with mandatory 4-module quiet zone.
 */
export default function QrCodeSvg({
  value,
  size = 112,
  label = 'Scannable Verifiable Credential QR Code',
  className = '',
}: QrCodeSvgProps) {
  const { modules, dimension, pathData } = useMemo(() => {
    const matrix = generateQrMatrix(value || 'https://karyasetu.gov.in/verify');
    const quietZone = 4;
    const dim = matrix.length + quietZone * 2;
    const cmds: string[] = [];

    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix.length; c++) {
        if (matrix[r][c]) {
          cmds.push(`M${c + quietZone},${r + quietZone}h1v1h-1z`);
        }
      }
    }

    return {
      modules: matrix.length,
      dimension: dim,
      pathData: cmds.join(''),
    };
  }, [value]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${dimension} ${dimension}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`${label} (${modules}x${modules} QR matrix)`}
      className={`bg-white rounded-xl border border-slate-200 shadow-xs ${className}`.trim()}
    >
      <rect width={dimension} height={dimension} fill="#ffffff" />
      <path d={pathData} fill="#0F172A" />
    </svg>
  );
}
