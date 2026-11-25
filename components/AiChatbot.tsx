'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Key,
  RotateCcw,
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Download,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';

import {
  QUICK_PROMPTS,
  type ChatMessage,
  type SpeechRecognitionInstance,
  type SpeechRecognitionResultEventLike,
  type SpeechRecognitionWindow,
} from '@/lib/chatConstants';

export default function AiChatbot() {
  const pathname = usePathname();
  const { student, updateSkillLevel, syncAbcCredits, opportunities, applyToOpportunity } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Voice State (STT & TTS)
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Initialize greeting with dynamic greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    const salutation = hour < 12 ? 'Shubh Prabhat' : hour < 17 ? 'Shubh Madhyahan' : 'Shubh Sandhya';

    const greeting: ChatMessage = {
      id: 'greet-1',
      role: 'assistant',
      content: `${salutation}! 🙏 I am **Ayush AI Saarthi**, your national clinical mentor and career advisor powered by **Google Gemini 1.5**.

I have loaded your live scholar profile:
• **Scholar**: **${student?.name || 'Ananya Sharma'}** (${student?.degree || 'BAMS Final Year'})
• **Readiness Score**: **${student?.readinessScore || 84}%** (NCISM Level 4 Autonomous Care)
• **Key Skill Gaps**: *Rasashastra QA*, *Dravyaguna Herb ID*, *Ayurveda EHR*
• **ABC / APAAR Ledger**: **${student?.abcCredits || 148} / 160 Credits**

How can I assist you today? You can speak using the 🎙️ **Microphone**, ask clinical pharmacology doubts, or tap any quick topic below!`,
      timestamp: 'Just now',
      provider: 'Google Gemini 1.5 Flash',
    };
    setMessages([greeting]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load ephemeral session API key (avoid persistent localStorage storage for secrets)
  useEffect(() => {
    try {
      const savedKey = sessionStorage.getItem('karyasetu-gemini-key');
      if (savedKey) setApiKey(savedKey);
    } catch {
      // Ignore storage access errors in restricted browsers
    }
  }, []);

  // Close chatbot on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.speechSynthesis?.cancel();
        setSpeakingId(null);
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Speech Recognition Setup (STT)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const speechWindow = window as SpeechRecognitionWindow;
      const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onresult = (event: SpeechRecognitionResultEventLike) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setVoiceNotice('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      setTimeout(() => setVoiceNotice(null), 5000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  // Text to Speech (TTS)
  const toggleSpeak = (id: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      window.speechSynthesis.cancel();
      // Strip markdown symbols for natural speech
      const cleanText = text
        .replace(/[#*`_~]/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/\$([^\$]+)\$/g, '$1');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-IN';

      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const saveApiKey = () => {
    try {
      if (apiKey.trim()) {
        sessionStorage.setItem('karyasetu-gemini-key', apiKey.trim());
      } else {
        sessionStorage.removeItem('karyasetu-gemini-key');
      }
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 2500);
      setShowSettings(false);
    } catch {
      // Ignore storage access errors
    }
  };

  const copyToClipboard = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadTranscript = () => {
    const header = `# KaryaSetu: Ayush AI Saarthi Consultation Transcript\nDate: ${new Date().toLocaleString()}\nScholar: ${student?.name || 'Ananya Sharma'}\n\n---\n\n`;
    const transcript = messages
      .map((m) => `**[${m.role.toUpperCase()} - ${m.timestamp}]**\n${m.content}\n`)
      .join('\n\n---\n\n');

    const blob = new Blob([header + transcript], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KaryaSetu_AI_Consultation_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    if (speakingId) {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const studentContext = {
        name: student?.name || 'Ananya Sharma',
        college: student?.college || 'AIIA New Delhi',
        degree: student?.degree || 'BAMS Final Year',
        readinessScore: student?.readinessScore || 84,
        skills: student?.skills || [],
        gaps: ['Rasashastra QA', 'Dravyaguna Herb Identification', 'Ayurveda EHR'],
        interests: student?.interests || [],
        abcCredits: student?.abcCredits || 148,
        currentPath: pathname,
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          context: studentContext,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            provider: data.provider,
            actionType: data.actionType,
            actionLabel: data.actionLabel,
            actionPayload: data.actionPayload,
          },
        ]);
      } else {
        throw new Error(data.error || 'Failed to generate response');
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unable to reach AI mentor';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Consultation error: ${errMsg}. Please verify network connectivity.`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          provider: 'System',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Execute interactive actions directly from chat bubble
  const handleExecuteAction = (msg: ChatMessage) => {
    if (msg.actionExecuted) return;

    if (msg.actionType === 'enroll_bridge') {
      const skillId = msg.actionPayload?.skillId || 'rasashastra-qa';
      const gain = msg.actionPayload?.gain || 1;
      updateSkillLevel(skillId, gain);

      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, actionExecuted: true } : m))
      );

      // Add feedback
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          role: 'assistant',
          content: `🎉 **Bridge Enrollment Confirmed!**\n• Course: **${msg.actionPayload?.name || 'AIIA-MSDE Bridge'}**\n• Skill Level: **+${gain} Level Gain**\n• Your 8-Axis Competency Radar and Industry Readiness have been updated on your live dashboard!`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          provider: 'KaryaSetu Live Store',
        },
      ]);
    } else if (msg.actionType === 'sync_abc') {
      syncAbcCredits();
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, actionExecuted: true } : m))
      );
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          role: 'assistant',
          content: `💳 **DigiLocker ABC Credits Synced!**\nVerified credits updated to **${Math.min(160, (student?.abcCredits || 148) + 4)} / 160 Minimum** with official NSQF Level 7 institutional ledger attestation.`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          provider: 'National Academic Depository (NAD)',
        },
      ]);
    } else if (msg.actionType === 'apply_opportunity') {
      const targetOpp = opportunities.find((o) => o.id === (msg.actionPayload?.opportunityId || 'opp-2')) || opportunities[0];
      if (targetOpp) {
        applyToOpportunity(targetOpp);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, actionExecuted: true } : m))
        );
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            role: 'assistant',
            content: `📝 **Application Submitted Successfully!**\nYour credential packet was submitted for **${targetOpp.title}** at **${targetOpp.company}**. Track status on your active dashboard!`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            provider: 'KaryaSetu Placement Grid',
          },
        ]);
      }
    }
  };

  const handleClearChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    const firstMsg = messages[0];
    setMessages(firstMsg ? [firstMsg] : []);
  };

  // Determine copilot contextual role badge
  const copilotBadge = pathname?.includes('assessment')
    ? 'Diagnostic Copilot'
    : pathname?.includes('internships')
    ? 'Placement Copilot'
    : pathname?.includes('portfolio')
    ? 'Attestation Copilot'
    : 'Clinical Remediation Copilot';

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-24 md:bottom-7 right-4 sm:right-7 z-50 animate-in fade-in zoom-in duration-300">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white shadow-[0_8px_32px_rgba(15,23,42,0.4)] hover:shadow-[0_12px_44px_rgba(242,110,36,0.45)] border border-amber-400/40 hover:scale-105 transition-all duration-300 backdrop-blur-md"
            aria-label="Open Ayush AI Saarthi"
          >
            {/* Pulsing Beacon Glow */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-saffron"></span>
            </span>

            <div className="w-7 h-7 rounded-full bg-saffron/20 border border-saffron/60 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>

            <div className="flex flex-col text-left">
              <span className="font-extrabold text-xs tracking-tight text-white flex items-center gap-1">
                Ayush AI Saarthi
              </span>
              <span className="font-mono text-[9px] text-amber-300/90 font-semibold uppercase tracking-wider">
                Gemini 1.5 • Smart Mentor
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Interactive Chat Window Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-dialog-title"
          className={`fixed z-50 transition-all duration-300 ease-out flex flex-col shadow-2xl ${
            isExpanded
              ? 'inset-3 sm:inset-6 md:inset-10 rounded-3xl'
              : 'bottom-20 md:bottom-6 right-3 sm:right-6 w-[95vw] sm:w-[460px] md:w-[490px] h-[640px] max-h-[86vh] rounded-3xl'
          } bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden`}
        >
          {/* Top Sovereign Indian Tricolor Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]" aria-hidden="true" />

          {/* Chat Header */}
          <div className="bg-navy-950 px-4 py-3 flex items-center justify-between text-white border-b border-navy-800 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-saffron/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                <Bot className="w-4.5 h-4.5 text-amber-300" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span id="chatbot-dialog-title" className="font-bold text-sm tracking-tight text-white truncate">
                    Ayush AI Saarthi
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 shrink-0">
                    Gemini 1.5
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" aria-hidden="true" />
                  <span className="truncate">{copilotBadge}</span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={downloadTranscript}
                className="p-1.5 rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition-colors"
                title="Download Consultation Summary (.md)"
                aria-label="Download consultation summary"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition-colors"
                title="Configure Gemini API Key"
                aria-label="Configure Gemini API key"
                aria-expanded={showSettings}
              >
                <Key className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition-colors"
                title="Reset Conversation"
                aria-label="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:inline-flex p-1.5 rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition-colors"
                title={isExpanded ? 'Restore Size' : 'Maximize'}
                aria-label={isExpanded ? 'Restore chat size' : 'Maximize chat window'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" /> : <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setSpeakingId(null);
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition-colors"
                title="Close"
                aria-label="Close Ayush AI Saarthi"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Gemini API Key Settings Drawer */}
          {showSettings && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/95 border-b border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-saffron" aria-hidden="true" />
                  Custom Google Gemini API Key (Session Only)
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {apiKey ? 'Key Configured ✓' : 'Local Fallback Active'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2">
                Paste your Gemini API key for live cloud reasoning. Stored only in ephemeral session memory and cleared on tab close.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  aria-label="Custom Google Gemini API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-saffron"
                />
                <button
                  type="button"
                  onClick={saveApiKey}
                  className="px-3 py-1.5 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-bold text-xs shrink-0 transition-colors"
                >
                  {keySaved ? 'Saved! ✓' : 'Save Key'}
                </button>
              </div>
            </div>
          )}

          {/* Active Scholar Live Context Bar */}
          <div className="px-3.5 py-2 bg-amber-50/80 dark:bg-amber-950/40 border-b border-amber-200/60 dark:border-amber-900/50 flex items-center justify-between gap-2 text-[11px] shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-navy-900 dark:text-amber-200 truncate">
                {student?.name || 'Ananya Sharma'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 dark:text-slate-400 truncate">
                {student?.degree || 'BAMS Final Year'}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 font-mono">
              <span className="font-bold px-2 py-0.5 rounded-full bg-saffron/15 dark:bg-saffron/30 text-saffron-dark dark:text-amber-300">
                Readiness: {student?.readinessScore || 84}%
              </span>
              <span className="font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hidden sm:inline">
                ABC: {student?.abcCredits || 148} Cr
              </span>
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-navy-950 text-amber-300 border border-amber-400/50 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3 sm:p-3.5 text-xs leading-relaxed shadow-xs ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-saffron to-amber-600 text-white font-medium rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-tl-none'
                  }`}
                >
                  {/* Provider Header with Copy & Audio Controls */}
                  {m.role === 'assistant' && (
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800 text-[9px] font-mono text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-saffron dark:text-amber-400">
                        <Sparkles className="w-2.5 h-2.5" />
                        {m.provider || 'Ayush AI'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {/* Audio TTS Button */}
                        <button
                          type="button"
                          onClick={() => toggleSpeak(m.id, m.content)}
                          className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                            speakingId === m.id ? 'text-saffron animate-pulse font-bold' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                          }`}
                          title={speakingId === m.id ? 'Stop Reading' : 'Listen with Voice'}
                          aria-label={speakingId === m.id ? 'Stop reading answer' : 'Listen to answer'}
                        >
                          {speakingId === m.id ? <VolumeX className="w-3 h-3" aria-hidden="true" /> : <Volume2 className="w-3 h-3" aria-hidden="true" />}
                        </button>

                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={() => copyToClipboard(m.id, m.content)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          title="Copy Answer"
                          aria-label="Copy answer to clipboard"
                        >
                          {copiedId === m.id ? (
                            <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                              <Check className="w-3 h-3" />
                            </span>
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="whitespace-pre-wrap space-y-1.5 font-normal">
                    {m.content}
                  </div>

                  {/* Smart Interactive Action Card */}
                  {m.role === 'assistant' && m.actionType && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        disabled={m.actionExecuted}
                        onClick={() => handleExecuteAction(m)}
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                          m.actionExecuted
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-saffron hover:bg-saffron-hover text-white hover:scale-[1.02]'
                        }`}
                      >
                        {m.actionExecuted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Action Executed &amp; Recorded! ✓</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-200" />
                            <span>{m.actionLabel || 'Execute Smart Action'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-saffron text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex gap-2.5 justify-start items-center animate-in fade-in">
                <div className="w-7 h-7 rounded-full bg-navy-950 text-amber-300 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 ml-1.5">
                    Ayush Saarthi is calculating clinical solution...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Recommendation Chips */}
          <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-saffron" />
                Suggested Clinical &amp; Career Queries:
              </span>
              <span className="font-mono text-[9px] text-slate-400">Tap to Ask</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-amber-950/40 text-slate-700 hover:text-saffron-dark dark:text-slate-300 dark:hover:text-amber-300 text-[10px] font-medium border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar with Voice (STT) & Send */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            {voiceNotice && (
              <div
                role="status"
                aria-live="polite"
                className="mb-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px] font-medium"
              >
                {voiceNotice}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              {/* Microphone Speech-to-Text Button */}
              <button
                type="button"
                onClick={toggleListening}
                aria-label={isListening ? 'Stop voice input' : 'Ask with voice'}
                className={`p-2.5 rounded-2xl border transition-all shrink-0 ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-700 animate-pulse shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                title={isListening ? 'Listening... Tap to stop' : 'Ask with Voice (Speech-to-Text)'}
              >
                {isListening ? <MicOff className="w-4 h-4" aria-hidden="true" /> : <Mic className="w-4 h-4" aria-hidden="true" />}
              </button>

              <input
                type="text"
                aria-label="Ask Ayush AI Saarthi a question"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening to your voice...' : 'Ask clinical doubts, formulations, or placement advice...'}
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-saffron"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-2xl bg-saffron hover:bg-saffron-hover text-white disabled:opacity-40 disabled:hover:bg-saffron transition-all shadow-xs shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1.5 px-1 font-mono">
              <span>NITI Aayog • Ministry of Ayush Aligned</span>
              <span>Audio Speech • Live Actions • Gemini 1.5</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
