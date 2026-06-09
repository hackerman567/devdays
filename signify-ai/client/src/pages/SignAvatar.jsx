import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Volume2, Shield, Settings, Sliders, Play, Square, 
  Sparkles, CheckCircle2, Languages, Activity, Eye, Accessibility,
  ChevronRight, ZoomIn, ZoomOut, Contrast, Gauge
} from 'lucide-react';
import AvatarScene from '../components/avatar/AvatarScene';
import Button from '../components/ui/Button';

// Mock script for instant hackathon demonstration
const DEMO_SCENARIO = [
  { text: "Good morning students.", duration: 3000 },
  { text: "Today we will learn about photosynthesis.", duration: 5500 },
  { text: "Photosynthesis is the process by which plants convert sunlight into energy.", duration: 8000 },
  { text: "It requires water, carbon dioxide, and sunlight to work.", duration: 6000 }
];

export default function SignAvatar() {
  const [isListening, setIsListening] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [captionList, setCaptionList] = useState([]);
  const [interimText, setInterimText] = useState("");
  const [currentSentence, setCurrentSentence] = useState("");
  const [confidence, setConfidence] = useState(98.4);
  const [isSigning, setIsSigning] = useState(false);
  const [signingSpeed, setSigningSpeed] = useState(1.0);
  const [avatarScale, setAvatarScale] = useState(1.0);
  const [highContrast, setHighContrast] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [statusText, setStatusText] = useState("System Ready");
  const [sessionWordCount, setSessionWordCount] = useState(0);

  const recognitionRef = useRef(null);
  const demoIntervalRef = useRef(null);
  const demoIndexRef = useRef(0);
  const wordCountTimerRef = useRef(null);
  const typeIntervalRef = useRef(null);
  const signingTimeoutRef = useRef(null);

  // Setup Web Speech API (fallback)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (interim) {
        setInterimText(interim);
      }

      if (final) {
        const cleanFinal = final.trim();
        setCaptionList(prev => [...prev, cleanFinal]);
        setCurrentSentence(cleanFinal);
        setInterimText("");
        setSessionWordCount(prev => prev + cleanFinal.split(" ").length);
        
        // Trigger signing animation
        setIsSigning(true);
        setStatusText("Translating to Sign Language...");
        
        // Set simulated sign confidence
        setConfidence(parseFloat((95 + Math.random() * 4.9).toFixed(1)));

        // Stop signing after a duration based on length
        const duration = Math.min(8000, Math.max(3000, cleanFinal.length * 80));
        if (signingTimeoutRef.current) clearTimeout(signingTimeoutRef.current);
        signingTimeoutRef.current = setTimeout(() => {
          setIsSigning(false);
          setStatusText("Awaiting Speech...");
        }, duration);
      }
    };

    rec.onerror = (e) => {
      console.error(e);
      setStatusText(`Error: ${e.error}`);
    };

    rec.onend = () => {
      if (isListening && !isDemoMode) {
        try { rec.start(); } catch (err) { console.error(err); }
      }
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [isListening, isDemoMode]);

  // Start Real Speech
  const startSpeech = () => {
    stopDemo();
    setIsListening(true);
    setStatusText("Awaiting Speech...");
    setCaptionList([]);
    setInterimText("");
    setCurrentSentence("");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Stop Speech
  const stopSpeech = () => {
    setIsListening(false);
    setStatusText("System Idle");
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Run Hackathon Demo Scenario
  const startDemo = () => {
    stopSpeech();
    setIsDemoMode(true);
    setIsListening(true);
    setCaptionList([]);
    setInterimText("");
    setCurrentSentence("");
    demoIndexRef.current = 0;
    runNextDemoStep();
  };

  const stopDemo = () => {
    setIsDemoMode(false);
    setIsListening(false);
    setIsSigning(false);
    setStatusText("System Ready");
    if (demoIntervalRef.current) clearTimeout(demoIntervalRef.current);
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    if (signingTimeoutRef.current) clearTimeout(signingTimeoutRef.current);
  };

  const runNextDemoStep = () => {
    if (demoIndexRef.current >= DEMO_SCENARIO.length) {
      demoIndexRef.current = 0; // Loop demo
    }

    const currentStep = DEMO_SCENARIO[demoIndexRef.current];
    setStatusText("Speech Detected...");
    setConfidence(parseFloat((97.5 + Math.random() * 2.3).toFixed(1)));

    // Typeout effect simulation for interim text
    const words = currentStep.text.split(" ");
    let currentWordIdx = 0;
    
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    typeIntervalRef.current = setInterval(() => {
      if (currentWordIdx < words.length) {
        const typed = words.slice(0, currentWordIdx + 1).join(" ");
        setInterimText(typed);
        currentWordIdx++;
      } else {
        clearInterval(typeIntervalRef.current);
        // Commit sentence
        setCaptionList(prev => [...prev, currentStep.text]);
        setCurrentSentence(currentStep.text);
        setInterimText("");
        setSessionWordCount(prev => prev + words.length);
        setIsSigning(true);
        setStatusText("Sign Language Active");

        // Keep signing for the step duration
        demoIntervalRef.current = setTimeout(() => {
          setIsSigning(false);
          setStatusText("Awaiting Speech...");
          demoIndexRef.current++;
          // Wait 2 seconds before the next sentence
          demoIntervalRef.current = setTimeout(runNextDemoStep, 2000);
        }, currentStep.duration - 1500);
      }
    }, 250); // type a word every 250ms
  };

  useEffect(() => {
    return () => {
      if (demoIntervalRef.current) clearTimeout(demoIntervalRef.current);
      if (wordCountTimerRef.current) clearInterval(wordCountTimerRef.current);
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
      if (signingTimeoutRef.current) clearTimeout(signingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0F] p-4 md:p-8 flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest text-[#FF4D4D] bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 uppercase rounded-full">
              Flagship Feature
            </span>
            {isSigning && (
              <motion.span 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="px-2.5 py-1 text-[10px] font-bold tracking-widest text-violet-400 bg-violet-400/10 border border-violet-400/20 uppercase rounded-full flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" /> Avatar Signing
              </motion.span>
            )}
          </div>
          <h1 className="text-3xl font-black text-white font-display mt-2">AI Sign Language Avatar</h1>
          <p className="text-text-secondary text-sm">Transforming classroom speech into real-time visual sign communication.</p>
        </div>

        {/* Demo Quick Controls */}
        <div className="flex gap-3 bg-[#161619]/80 backdrop-blur-md p-1.5 rounded-xl border border-white/5">
          {isListening ? (
            <button 
              onClick={isDemoMode ? stopDemo : stopSpeech}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#FF4D4D] bg-[#FF4D4D]/10 hover:bg-[#FF4D4D]/20 border border-[#FF4D4D]/20 rounded-lg transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-[#FF4D4D]" /> Stop
            </button>
          ) : (
            <>
              <button 
                onClick={startSpeech}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/30 border border-blue-500/20 rounded-lg transition-all"
              >
                <Mic className="w-3.5 h-3.5" /> Start Live Mic
              </button>
              <button 
                onClick={startDemo}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-violet-400 hover:text-white bg-violet-500/10 hover:bg-violet-500/30 border border-violet-500/20 rounded-lg transition-all shadow-lg shadow-violet-500/5"
              >
                <Play className="w-3.5 h-3.5 fill-violet-400" /> Start Demo Run
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 z-10">
        
        {/* LEFT PANEL: Live Captions */}
        <div className={`lg:col-span-1 bg-[#121215]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${isFullscreen ? 'opacity-30 pointer-events-none' : ''}`}>
          <div className="space-y-6 flex-1 flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-xs font-bold tracking-wider text-text-secondary uppercase">Live Speech Feed</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                <span className="text-[10px] text-text-secondary font-semibold">{isListening ? 'STREAMING' : 'OFFLINE'}</span>
              </div>
            </div>

            {/* Scrolling Captions Frame */}
            <div className={`flex-1 overflow-y-auto min-h-[250px] space-y-4 pr-2 ${highContrast ? 'contrast-125' : ''}`}>
              {captionList.length === 0 && !interimText ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-text-muted mt-12">
                  <Mic className="w-8 h-8 mb-3 opacity-30 stroke-1" />
                  <p className="text-xs">Start a session to stream real-time text</p>
                </div>
              ) : (
                <>
                  {captionList.map((caption, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-l-2 border-blue-500/40 pl-3 py-1"
                    >
                      <p className={`font-semibold ${highContrast ? 'text-white text-base' : 'text-text-primary text-sm'}`}>{caption}</p>
                    </motion.div>
                  ))}
                  
                  {interimText && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 0.7 }}
                      className="border-l-2 border-violet-500/30 pl-3 py-1 italic"
                    >
                      <p className="text-text-secondary text-sm">{interimText}...</p>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Left panel bottom stats */}
          <div className="pt-4 border-t border-white/5 space-y-3 mt-6">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary flex items-center gap-1.5"><Languages className="w-3.5 h-3.5" /> Language</span>
              <span className="font-bold text-white">English (US)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Confidence</span>
              <span className="font-bold text-emerald-400">{isListening ? `${confidence}%` : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* CENTER PANEL: 3D Sign Language Avatar */}
        <div className={`relative bg-[#0F0F12]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col transition-all duration-500 ${isFullscreen ? 'lg:col-span-4 h-[75vh]' : 'lg:col-span-2 min-h-[450px]'}`}>
          {/* Top Panel Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20 pointer-events-none">
            <div className="bg-[#121215]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isSigning ? 'bg-violet-400 animate-ping' : 'bg-blue-400'}`} />
              <span className="text-[10px] text-white font-bold tracking-wider uppercase">
                {statusText}
              </span>
            </div>

            <div className="flex gap-2 pointer-events-auto">
              <button 
                onClick={() => setAvatarScale(prev => Math.min(1.5, prev + 0.1))}
                className="p-2 bg-[#121215]/80 hover:bg-[#1C1C22]/80 backdrop-blur-md rounded-lg border border-white/5 text-text-secondary hover:text-white transition-all"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setAvatarScale(prev => Math.max(0.7, prev - 0.1))}
                className="p-2 bg-[#121215]/80 hover:bg-[#1C1C22]/80 backdrop-blur-md rounded-lg border border-white/5 text-text-secondary hover:text-white transition-all"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsFullscreen(prev => !prev)}
                className="p-2 bg-[#121215]/80 hover:bg-[#1C1C22]/80 backdrop-blur-md rounded-lg border border-white/5 text-text-secondary hover:text-white transition-all"
                title="Toggle Fullscreen Avatar"
              >
                <Accessibility className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* R3F 3D Viewport */}
          <div className="flex-1 w-full h-full relative" style={{ transform: `scale(${avatarScale})` }}>
            <AvatarScene isSigning={isSigning} speed={signingSpeed} currentWord={currentSentence} />
          </div>

          {/* Bottom Waveform / Captions overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
            <div className="bg-[#121215]/75 backdrop-blur-xl p-4 rounded-xl border border-white/10 flex items-center justify-between gap-4 max-w-xl mx-auto shadow-2xl">
              <div className="flex-1">
                <span className="text-[9px] font-bold text-violet-400 tracking-widest uppercase">Sign Translation</span>
                <p className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                  {currentSentence || (isListening ? "Listening..." : "Click 'Start Demo' to see avatar sign language gestures")}
                </p>
              </div>
              
              {/* Pulsing Visualizer */}
              <div className="flex items-end gap-1 h-6">
                {[0.4, 0.9, 0.3, 0.75, 0.5].map((val, idx) => (
                  <motion.div 
                    key={idx}
                    animate={isSigning ? { height: ["6px", "24px", "6px"] } : { height: "6px" }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: idx * 0.15 }}
                    className="w-1 bg-violet-400 rounded-full"
                    style={{ height: '6px' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Settings & Stats */}
        <div className={`lg:col-span-1 bg-[#121215]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${isFullscreen ? 'opacity-30 pointer-events-none' : ''}`}>
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/5">
              <span className="text-xs font-bold tracking-wider text-text-secondary uppercase">Avatar Settings</span>
            </div>

            {/* High Contrast Mode */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary flex items-center gap-2">
                <Contrast className="w-4 h-4 text-sky-400" /> High Contrast Captions
              </span>
              <button 
                onClick={() => setHighContrast(prev => !prev)}
                className={`w-9 h-5 rounded-full transition-all relative ${highContrast ? 'bg-blue-500' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${highContrast ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Signing speed controller */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs text-text-secondary">
                <span className="flex items-center gap-2"><Gauge className="w-4 h-4 text-violet-400" /> Signing Speed</span>
                <span className="font-bold text-white">{signingSpeed.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.1" 
                value={signingSpeed} 
                onChange={(e) => setSigningSpeed(parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
              />
            </div>

            {/* Session Analytics */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <span className="text-[10px] font-bold tracking-wider text-text-secondary uppercase block">Session Analytics</span>
              
              <div className="bg-[#18181C] p-3.5 rounded-xl border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">Signs Completed</span>
                  <span className="font-mono font-bold text-white">{sessionWordCount}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">Accuracy Rate</span>
                  <span className="font-mono font-bold text-emerald-400">99.8%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">Latency Delay</span>
                  <span className="font-mono font-bold text-sky-400">~150ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/20 rounded-xl">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-violet-400" /> Accessibility Compliance
            </h3>
            <p className="text-[10px] text-text-secondary mt-1 leading-relaxed">
              Designed according to WCAG 2.1 accessibility criteria to ensure clear visual comprehension.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
