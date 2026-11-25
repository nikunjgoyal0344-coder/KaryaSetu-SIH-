import { NextRequest, NextResponse } from 'next/server';
import { sanitizeString } from '@/lib/security';
import { badRequest, enforceRateLimit, parseJsonBody, serverError } from '@/lib/apiHelpers';
import {
  generateLocalAyushResponse,
  type StudentChatContext,
} from '@/lib/backend/ayushKnowledge';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * POST /api/ai/chat
 * Handles real-time conversation via Google Gemini 1.5 Flash API
 * with automatic fallback to Ayush domain reasoning and action triggers.
 */
export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'ai:chat', 40, 60_000);
  if (limited) return limited;

  try {
    const body = await parseJsonBody<{
      messages?: unknown;
      context?: unknown;
      apiKey?: unknown;
    }>(req);

    if (!body) {
      return badRequest('Invalid JSON request body');
    }

    const rawMessages = Array.isArray(body.messages) ? body.messages : [];
    const messages: ChatMessage[] = rawMessages
      .filter(
        (m): m is { role: unknown; content: unknown } =>
          Boolean(m && typeof m === 'object' && 'content' in m)
      )
      .slice(-20)
      .map((m) => ({
        role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: sanitizeString(m.content, 2000),
      }))
      .filter((m) => m.content.length > 0);

    if (messages.length === 0) {
      return badRequest('At least one non-empty message is required');
    }

    const context: StudentChatContext =
      body.context && typeof body.context === 'object' ? (body.context as StudentChatContext) : {};
    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage?.content || '';

    const clientApiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : '';
    const apiKey =
      (clientApiKey.length >= 20 && clientApiKey.length <= 128 ? clientApiKey : '') ||
      process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const systemInstruction = `You are "KaryaSetu Ayush Saarthi", an authoritative AI Mentor, Career Advisor, and Clinical Doubt Solver for the National Ayush Skilling and Internship Grid (developed in alignment with NITI Aayog, Ministry of Ayush, and MSDE guidelines).
You assist BAMS, Ayurveda, and Life Sciences scholars with:
1. Clinical doubts across Dravyaguna, Rasashastra, Panchakarma, Roganidana, and Shalya Tantra (Ksharasutra).
2. National digital health compliance (ABDM, AyushGrid, NAMASTE Portal, WHO ICD-11 Traditional Medicine Module 2).
3. Quality assurance and AFI/PLIM standards (Bhasma particle testing, heavy metal ICP-MS/AAS standards, TLC/HPTLC).
4. Personalized internship guidance based on candidate readiness score (${context.readinessScore || 84}%), active skills, and skill gaps (${(context.gaps || []).join(', ') || 'Rasashastra QA, Herb Identification'}).
5. Academic Bank of Credits (ABC / APAAR ID) under NEP 2020.

Tone: Authoritative, encouraging, scientifically grounded, sovereign, and structured. Use Markdown headings, bullet points, and LaTeX formulas where appropriate. Always prioritize patient safety and standard monographs.`;

        const contents = messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const response = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            signal: AbortSignal.timeout(10_000),
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemInstruction }] },
              contents,
              generationConfig: { temperature: 0.7, maxOutputTokens: 1000, topP: 0.9 },
            }),
          }
        );

        if (response.ok) {
          const geminiData = await response.json();
          const localFallback = generateLocalAyushResponse(userPrompt, context);
          const replyText =
            geminiData.candidates?.[0]?.content?.parts?.[0]?.text || localFallback.text;

          return NextResponse.json({
            success: true,
            provider: 'Google Gemini 1.5 Flash',
            reply: replyText,
            actionType: localFallback.actionType,
            actionLabel: localFallback.actionLabel,
            actionPayload: localFallback.actionPayload,
          });
        }
      } catch (geminiError: unknown) {
        console.warn(
          'Gemini API call failed, switching to local knowledge engine:',
          geminiError instanceof Error ? geminiError.message : 'Unknown error'
        );
      }
    }

    const localResult = generateLocalAyushResponse(userPrompt, context);
    return NextResponse.json({
      success: true,
      provider: 'KaryaSetu Domain AI Engine (Offline / Local Mode)',
      reply: localResult.text,
      actionType: localResult.actionType,
      actionLabel: localResult.actionLabel,
      actionPayload: localResult.actionPayload,
    });
  } catch (error: unknown) {
    return serverError('ai/chat', error, 'Chat processing failed');
  }
}
