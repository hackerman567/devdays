import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { getStorageStats, clearAllLectures } from '../lib/db';
import { SUPPORTED_LANGUAGES } from '../lib/translate';

import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

import { 
  Sliders, 
  Eye, 
  Cpu, 
  Trash2, 
  AlertTriangle,
  Moon,
  HardDrive
} from 'lucide-react';

export default function Settings() {
  const {
    targetLanguage,
    autoTranslate,
    autoSummarize,
    captionFontSize,
    reduceMotion,
    groqApiKey,
    captionStyle,
    bgOpacity,
    lineSpacing,
    actions
  } = useSettingsStore();

  const [dbStats, setDbStats] = useState({ count: 0, estimatedSizeKB: 0 });
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(groqApiKey);

  // Load IndexedDB statistics
  const loadDbStats = async () => {
    try {
      const stats = await getStorageStats();
      setDbStats(stats);
    } catch (e) {
      console.error('Failed to retrieve DB stats:', e);
    }
  };

  useEffect(() => {
    loadDbStats();
  }, []);

  const handleSaveApiKey = () => {
    actions.setApiKey(localApiKey.trim());
    toast.success('Groq API Key saved successfully!');
  };

  const handleClearDatabase = async () => {
    try {
      await clearAllLectures();
      setDbStats({ count: 0, estimatedSizeKB: 0 });
      setConfirmClearOpen(false);
      toast.success('IndexedDB database wiped successfully.');
    } catch (err) {
      toast.error('Failed to clear database.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 select-none">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight font-display">
          Application Settings
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Customize transcript sizes, translate targets, and adjust interface behaviors
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Category Links (Visual Only) */}
        <div className="md:col-span-1 space-y-2">
          <div className="p-4 bg-bg-surface border border-border-subtle rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary font-display border-b border-border-subtle pb-2">
              Accessibility First
            </h3>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Signify AI is built to meet WCAG 2.1 standards, ensuring maximum legibility, contrasting options, and motion reductions for users in the classroom.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <span className="text-[10px] text-accent-coral flex items-center gap-1.5 font-semibold">
                <Moon className="w-3.5 h-3.5" />
                Dark Theme Active (Locked)
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Options Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section: Appearance */}
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <Eye className="w-5 h-5 text-accent-coral" />
              <h2 className="font-bold text-text-primary text-base font-display">Caption Appearance</h2>
            </div>

            <div className="space-y-4">
              {/* Font Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Font Size Preference</label>
                <div className="grid grid-cols-4 gap-2">
                  {['md', 'lg', 'xl', '2xl'].map((size) => (
                    <button
                      key={size}
                      onClick={() => actions.setCaptionFontSize(size)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border capitalize transition-colors ${
                        captionFontSize === size
                          ? 'bg-accent-coral/15 text-accent-coral border-accent-coral/30'
                          : 'bg-bg-elevated text-text-secondary border-border-subtle hover:text-text-primary hover:border-text-secondary/25'
                      }`}
                    >
                      {size === 'md' ? 'Medium' : size === 'lg' ? 'Large' : size === 'xl' ? 'Extra Large' : 'Display'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Style */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Caption Contrast Style</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => actions.setCaptionStyle('standard')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      captionStyle === 'standard'
                        ? 'bg-accent-coral/15 text-accent-coral border-accent-coral/30'
                        : 'bg-bg-elevated text-text-secondary border-border-subtle hover:text-text-primary'
                    }`}
                  >
                    Standard Cream White
                  </button>
                  <button
                    onClick={() => actions.setCaptionStyle('contrast')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      captionStyle === 'contrast'
                        ? 'bg-accent-coral/15 text-accent-coral border-accent-coral/30'
                        : 'bg-bg-elevated text-text-secondary border-border-subtle hover:text-text-primary'
                    }`}
                  >
                    High Contrast Pure White
                  </button>
                </div>
              </div>

              {/* Line Spacing */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Caption Line Spacing</label>
                <div className="grid grid-cols-4 gap-2">
                  {['tight', 'normal', 'relaxed', 'loose'].map((spacing) => (
                    <button
                      key={spacing}
                      onClick={() => actions.setLineSpacing(spacing)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                        lineSpacing === spacing
                          ? 'bg-accent-coral/15 text-accent-coral border-accent-coral/30'
                          : 'bg-bg-elevated text-text-secondary border-border-subtle hover:text-text-primary'
                      }`}
                    >
                      {spacing}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Opacity */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-text-secondary uppercase tracking-wider">
                  <span>Caption Background Opacity</span>
                  <span className="text-accent-coral">{bgOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={bgOpacity}
                  onChange={(e) => actions.setBgOpacity(Number(e.target.value))}
                  className="w-full accent-accent-coral bg-bg-elevated border border-border-subtle h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section: AI Configuration */}
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <Cpu className="w-5 h-5 text-accent-coral" />
              <h2 className="font-bold text-text-primary text-base font-display">AI & Summarization Preferences</h2>
            </div>

            <div className="space-y-4">
              {/* API Key */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Groq API Key (Client Override)</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={localApiKey}
                    onChange={(e) => setLocalApiKey(e.target.value)}
                    placeholder="Enter your GROQ_API_KEY (optional)..."
                    className="flex-1 bg-bg-elevated border border-border-subtle hover:border-accent-coral/20 focus:border-accent-coral focus:ring-1 focus:ring-accent-coral/30 rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none transition-colors"
                  />
                  <Button onClick={handleSaveApiKey} variant="ghost" size="sm">
                    Save Key
                  </Button>
                </div>
                <p className="text-[10px] text-text-muted leading-relaxed mt-1">
                  Optional. If empty, the client routes requests through the local Express server. Providing an API key stores it locally in your browser for direct requests.
                </p>
              </div>

              {/* Language Preferences */}
              <div className="flex items-center justify-between py-2 border-t border-b border-border-subtle/40">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Summary Target Language</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">Translate generated summaries into this language</p>
                </div>
                <select
                  value={targetLanguage}
                  onChange={(e) => actions.setTargetLanguage(e.target.value)}
                  className="bg-bg-elevated border border-border-subtle rounded-md px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:border-accent-coral transition-colors cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Automation Toggles */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">Auto-Translate Captions</h4>
                    <p className="text-[10px] text-text-secondary mt-0.5">Automatically translate real-time captions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoTranslate}
                      onChange={actions.toggleAutoTranslate}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-bg-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary peer-checked:after:bg-accent-coral after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-coral/20 border border-border-subtle"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">Auto-Summarize Session</h4>
                    <p className="text-[10px] text-text-secondary mt-0.5">Generate a summary automatically when session ends</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSummarize}
                      onChange={actions.toggleAutoSummarize}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-bg-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary peer-checked:after:bg-accent-coral after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-coral/20 border border-border-subtle"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Accessibility settings */}
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <Sliders className="w-5 h-5 text-accent-coral" />
              <h2 className="font-bold text-text-primary text-base font-display">Accessibility Controls</h2>
            </div>

            <div className="space-y-4">
              {/* Reduce motion toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Reduce Animations</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">Disable intensive page transitions and count-ups</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reduceMotion}
                    onChange={actions.toggleReduceMotion}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-bg-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary peer-checked:after:bg-accent-coral after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-coral/20 border border-border-subtle"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Section: Storage & Data */}
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <HardDrive className="w-5 h-5 text-accent-coral" />
              <h2 className="font-bold text-text-primary text-base font-display">Local DB Storage & Data</h2>
            </div>

            <div className="space-y-4">
              {/* Stats Card inside settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-elevated border border-border-subtle rounded-lg p-3">
                  <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Total Saved Lectures</span>
                  <div className="text-lg font-bold text-text-primary mt-0.5">{dbStats.count} sessions</div>
                </div>
                <div className="bg-bg-elevated border border-border-subtle rounded-lg p-3">
                  <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">IndexedDB Used Size</span>
                  <div className="text-lg font-bold text-text-primary mt-0.5">{dbStats.estimatedSizeKB.toFixed(1)} KB</div>
                </div>
              </div>

              {/* Warning Area */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Wipe Local Database</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">Permanently delete all lecture archives and settings</p>
                </div>
                <Button
                  onClick={() => setConfirmClearOpen(true)}
                  disabled={dbStats.count === 0}
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                >
                  Wipe Database
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Wiping Modal */}
      <Modal isOpen={confirmClearOpen} onClose={() => setConfirmClearOpen(false)} title="Permanently Wipe Local Database?">
        <div className="space-y-4">
          <div className="flex gap-3 items-start p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Caution: Destructive Action</p>
              <p className="text-[10px] leading-relaxed mt-0.5">
                Wiping the database deletes all saved lecture audio transcripts, inline translation scripts, and AI generated summaries from the browser. This cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button onClick={() => setConfirmClearOpen(false)} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button onClick={handleClearDatabase} variant="danger" size="sm">
              Confirm Wipe
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
