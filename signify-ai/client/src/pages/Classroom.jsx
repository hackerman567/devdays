import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTranslation } from '../hooks/useTranslation';
import { useCaptionStore } from '../store/useCaptionStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useLectureStore } from '../store/useLectureStore';
import { saveLecture } from '../lib/db';
import { SUPPORTED_LANGUAGES } from '../lib/translate';

import LiveCaptionPanel from '../components/classroom/LiveCaptionPanel';
import HeatmapTimeline from '../components/classroom/HeatmapTimeline';
import QRJoinPanel from '../components/classroom/QRJoinPanel';
import LectureSummarizer from '../components/ai/LectureSummarizer';
import AskAI from '../components/ai/AskAI';
import { useGroqAI } from '../hooks/useGroqAI';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

import { 
  Mic, 
  MicOff, 
  Save, 
  Download, 
  Languages, 
  BrainCircuit, 
  MessageSquare,
  Clock,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function Classroom() {
  const { isListening, isDemoMode, toggleListening, toggleDemo } = useSpeechRecognition();
  const { translateLine } = useTranslation();
  
  const { 
    finalTranscript, 
    interimText, 
    wordCount, 
    startTime, 
    sessionId,
    actions: captionActions
  } = useCaptionStore();

  const {
    targetLanguage,
    autoTranslate,
    autoSummarize,
    actions: settingsActions
  } = useSettingsStore();

  const { actions: lectureActions } = useLectureStore();

  // Classroom Page Local UI states
  const [activeRightTab, setActiveRightTab] = useState('summary'); // summary | ask_tutor
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const { generateSummary } = useGroqAI();
  const prevIsListening = useRef(isListening);

  // Auto-Summarize effect
  useEffect(() => {
    if (prevIsListening.current === true && isListening === false) {
      if (autoSummarize) {
        const fullText = [...finalTranscript, interimText].filter(Boolean).join(' ');
        if (fullText.length >= 50 && !useLectureStore.getState().currentSummary) {
          generateSummary(fullText);
        }
      }
    }
    prevIsListening.current = isListening;
  }, [isListening, autoSummarize, finalTranscript, interimText, generateSummary]);

  // Live Timer execution
  useEffect(() => {
    let interval = null;
    if (isListening && startTime) {
      interval = setInterval(() => {
        const diff = Math.round((new Date() - new Date(startTime)) / 1000);
        setElapsedSeconds(diff);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening, startTime]);

  // Translate incoming sentences in real-time
  useEffect(() => {
    if (finalTranscript.length > 0) {
      const lastIdx = finalTranscript.length - 1;
      const lastLine = finalTranscript[lastIdx];
      translateLine(lastLine, lastIdx);
    }
  }, [finalTranscript.length, autoTranslate, targetLanguage, translateLine]);

  // Format seconds to HH:MM:SS / MM:SS
  const formatTimer = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [
      h > 0 ? String(h).padStart(2, '0') : null,
      String(m).padStart(2, '0'),
      String(s).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  // Estimated reading speed (200 words per minute)
  const estimatedReadingTime = Math.ceil(wordCount / 200) || 1;

  // Export transcript as .txt file
  const handleExportTxt = () => {
    if (finalTranscript.length === 0) {
      toast.error('Transcript is empty. Capture some speech or try the demo first.');
      return;
    }

    const titleStr = `SIGNIFY AI - Lecture Notes (${new Date().toLocaleDateString()})`;
    const dateStr = `Date: ${new Date().toLocaleString()}`;
    const transcriptHeader = '\n--- ORIGINAL CAPTION TRANSCRIPT ---\n';
    const transcriptBody = finalTranscript.join('\n');
    
    let content = `${titleStr}\n${dateStr}\n${transcriptHeader}${transcriptBody}`;

    // Append translation if autoTranslate is active
    if (autoTranslate) {
      const activeLanguage = SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage;
      const translationLines = useCaptionStore.getState().translatedLines;
      const translationHeader = `\n\n--- TRANSLATED SUBTITLES (${activeLanguage.toUpperCase()}) ---\n`;
      const translationBody = translationLines.filter(Boolean).join('\n');
      content += `${translationHeader}${translationBody}`;
    }

    // Append AI summary if generated
    const currentSummary = useLectureStore.getState().currentSummary;
    if (currentSummary) {
      content += `\n\n--- AI SUMMARY & EXAM REVISION ---\n${currentSummary}`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signify-lecture-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Notes exported successfully!');
  };

  // Save Lecture to IndexedDB
  const handleSaveLecture = async () => {
    if (finalTranscript.length === 0) {
      toast.error('Cannot save empty lecture. Start speaking or run the demo first.');
      return;
    }

    const userTitle = prompt(
      'Provide a title for this lecture session:',
      `Lecture - ${new Date().toLocaleDateString()}`
    );
    
    if (userTitle === null) return; // User cancelled prompt

    const title = userTitle.trim() || `Lecture - ${new Date().toLocaleDateString()}`;

    const lectureData = {
      title,
      transcript: finalTranscript.join(' '),
      translatedTranscript: useCaptionStore.getState().translatedLines.filter(Boolean).join(' '),
      targetLanguage,
      summary: useLectureStore.getState().currentSummary || '',
      keyPoints: useLectureStore.getState().keyPoints || [],
      examQuestions: useLectureStore.getState().examQuestions || [],
      wordCount,
      duration: elapsedSeconds || 1,
      createdAt: new Date().toISOString(),
      sessionId
    };

    try {
      await saveLecture(lectureData);
      toast.success('Lecture archived to history!');
    } catch (err) {
      console.error(err);
      toast.error(`Failed to archive lecture: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 h-[calc(100vh-4rem)]">
      
      {/* Upper Split Panels (60% Caption Panel, 40% Control & AI Panels) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-6 min-h-0">
        
        {/* Left Side: Live Caption panel */}
        <div className="lg:col-span-6 flex flex-col min-h-0">
          <LiveCaptionPanel />
        </div>

        {/* Right Side: AI Control Center & Tutor */}
        <div className="lg:col-span-4 flex flex-col min-h-0 bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
          
          {/* Tab Selection Header */}
          <div className="flex border-b border-border-subtle bg-bg-surface/50">
            <button
              onClick={() => setActiveRightTab('summary')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold font-display uppercase tracking-wider transition-colors border-b-2 focus:outline-none ${
                activeRightTab === 'summary'
                  ? 'border-accent-coral text-accent-coral bg-accent-coral/5'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated/20'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              Summary Analysis
            </button>
            <button
              onClick={() => setActiveRightTab('ask_tutor')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold font-display uppercase tracking-wider transition-colors border-b-2 focus:outline-none ${
                activeRightTab === 'ask_tutor'
                  ? 'border-accent-coral text-accent-coral bg-accent-coral/5'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated/20'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Ask AI Tutor
            </button>
          </div>

          {/* AI Settings Overlay Control Panel */}
          <div className="px-5 py-3.5 border-b border-border-subtle bg-bg-elevated/50 flex flex-wrap gap-4 items-center justify-between">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-accent-coral" />
              <select
                value={targetLanguage}
                onChange={(e) => settingsActions.setTargetLanguage(e.target.value)}
                className="bg-bg-surface border border-border-subtle rounded-md px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:border-accent-coral transition-colors cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Automation Toggles */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoTranslate}
                  onChange={settingsActions.toggleAutoTranslate}
                  className="rounded border-border-subtle text-accent-coral focus:ring-0 cursor-pointer w-3.5 h-3.5"
                />
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Auto-Translate</span>
              </label>
              
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSummarize}
                  onChange={settingsActions.toggleAutoSummarize}
                  className="rounded border-border-subtle text-accent-coral focus:ring-0 cursor-pointer w-3.5 h-3.5"
                />
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Auto-Summarize</span>
              </label>
            </div>
          </div>

          {/* QR Share Panel */}
          <div className="px-5 pb-2">
            <QRJoinPanel />
          </div>

          {/* Tab Content Areas */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeRightTab === 'summary' ? (
              <LectureSummarizer />
            ) : (
              <AskAI />
            )}
          </div>
        </div>
      </div>

      <HeatmapTimeline />

      {/* Bottom Bar: Controllers & Metrics */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 md:px-6 flex flex-wrap gap-4 items-center justify-between shrink-0 relative z-50">
        
        {/* Left Side Controls (Start/Stop Recording & Simulation) */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={toggleListening}
            variant={isListening && !isDemoMode ? 'danger' : 'primary'}
            icon={isListening && !isDemoMode ? MicOff : Mic}
            className="font-display font-bold uppercase tracking-wider"
          >
            {isListening && !isDemoMode ? 'Stop Recording' : 'Start Session'}
          </Button>

          <Button
            onClick={toggleDemo}
            variant="ghost"
            icon={Sparkles}
            className="text-xs uppercase tracking-wider"
          >
            {isListening && isDemoMode ? 'Stop Demo' : 'Try Demo'}
          </Button>
        </div>

        {/* Center Indicators (Session Active details) */}
        {isListening && (
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-text-secondary bg-black/10 px-4 py-2 rounded-lg border border-border-subtle">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent-coral" />
              <span>Duration: <strong className="text-text-primary">{formatTimer(elapsedSeconds)}</strong></span>
            </div>
            <div className="hidden sm:block h-3 w-px bg-border-subtle" />
            <div>
              <span>Captured: <strong className="text-text-primary">{wordCount} words</strong></span>
            </div>
            <div className="hidden sm:block h-3 w-px bg-border-subtle" />
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-accent-coral" />
              <span>Est. Reading: <strong className="text-text-primary">{estimatedReadingTime} min</strong></span>
            </div>
          </div>
        )}

        {/* Right Side Actions (Save, Export Notes) */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSaveLecture}
            disabled={finalTranscript.length === 0}
            variant="ghost"
            size="sm"
            icon={Save}
          >
            Save Lecture
          </Button>
          <Button
            onClick={handleExportTxt}
            disabled={finalTranscript.length === 0}
            variant="ghost"
            size="sm"
            icon={Download}
          >
            Export Notes (.txt)
          </Button>
        </div>
      </div>
    </div>
  );
}
