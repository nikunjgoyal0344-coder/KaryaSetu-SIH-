export interface ChatActionPayload {
  skillId?: string;
  gain?: number;
  name?: string;
  opportunityId?: string;
}

export interface SpeechRecognitionResultEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

export interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: string;
  actionType?: string;
  actionLabel?: string;
  actionPayload?: ChatActionPayload;
  actionExecuted?: boolean;
}

export const QUICK_PROMPTS: readonly string[] = [
  '⚡ How can I bridge my Rasashastra QA gap?',
  '🎯 Which internships match my profile best?',
  '🔬 Explain AFI Bhasma heavy metal limits',
  '⚕️ SOP for Ksharasutra preparation in Shalya Tantra',
  '🌿 Panchakarma Shodhana protocols & contraindications',
  '💳 How many ABC credits do I need to graduate?',
];
