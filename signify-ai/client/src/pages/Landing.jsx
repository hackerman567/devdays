import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  LayoutDashboard, 
  Mic, 
  Languages, 
  BookOpen, 
  BrainCircuit, 
  ShieldCheck, 
  HardDrive,
  Cpu,
  ChevronRight,
  Github,
  Accessibility
} from 'lucide-react';
import AnimatedText from '../components/ui/AnimatedText';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatsCard from '../components/ui/StatsCard';

export default function Landing() {
  const navigate = useNavigate();
  const [parallaxCoords, setParallaxCoords] = useState({ x: 0, y: 0 });

  // Handle subtle mouse parallax movement on the mockup
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = (clientX - width / 2) / 35;
    const y = (clientY - height / 2) / 35;
    setParallaxCoords({ x, y });
  };

  const steps = [
    { num: '01', title: 'Capture', desc: 'Microphone listens to live classroom audio stream.' },
    { num: '02', title: 'Transcribe', desc: 'Native Speech recognition outputs word-by-word captions.' },
    { num: '03', title: 'Translate', desc: 'Instantly overlays subtitles in 50+ regional languages.' },
    { num: '04', title: 'Summarize', desc: 'AI extracts notes, exam guides, and takeaways.' },
    { num: '05', title: 'Deliver', desc: 'Responsive dashboard and searchable offline history.' }
  ];

  const features = [
    { 
      icon: Mic, 
      title: 'Live Captions', 
      desc: 'Transcribe spoken words word-by-word into large, highly readable captions with real-time text-highlighting.' 
    },
    { 
      icon: BrainCircuit, 
      title: 'AI Study Notes', 
      desc: 'Let llama3 analyze the lecture to generate concise summaries, bullet points, and key revision materials.' 
    },
    { 
      icon: Languages, 
      title: '50+ Languages', 
      desc: 'Support auto-translations dynamically, overlaying translated sentences directly underneath speech captions.' 
    },
    { 
      icon: LayoutDashboard, 
      title: 'Smart Analytics', 
      desc: 'Monitor lecture counts, words captured, and weekly learning graphs to visually track study habits.' 
    },
    { 
      icon: HardDrive, 
      title: 'Local Archiving', 
      desc: 'Full lecture histories are saved locally in the browser database (IndexedDB) for secure offline review.' 
    },
    { 
      icon: ShieldCheck, 
      title: 'WCAG 2.1 Compliant', 
      desc: 'Designed for accessibility with custom high-contrast overlays, font adjustments, and reduced motion toggles.' 
    }
  ];

  const marqueeTechnologies = [
    'Groq Llama 3', 'Web Speech API', 'React 18', 'Tailwind CSS', 'Framer Motion', 
    'IndexedDB (IDB)', 'Node.js', 'Express.js', 'MyMemory API', 'Zustand State', 'Recharts'
  ];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-bg-base bg-grid-pattern relative overflow-hidden noise-overlay select-none"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-coral/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headings & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <Badge variant="language" className="py-1 px-3 uppercase tracking-wider text-xs">
              GitHub DevDays Hackathon Submission
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-none font-display">
              <AnimatedText text="Every Voice. Every Student. Every Classroom." delay={0.1} />
            </h1>
            
            <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Signify AI breaks educational barriers for deaf and hard-of-hearing students. 
              Transform spoken lecture audio into real-time captions, translations, and AI summaries.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Button 
                onClick={() => navigate('/classroom')} 
                variant="primary" 
                size="lg"
                icon={Play}
              >
                Start Live Session
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')} 
                variant="ghost" 
                size="lg"
                icon={LayoutDashboard}
              >
                View Dashboard
              </Button>
            </div>
          </div>

          {/* Right Column: Floating Classroom Mockup */}
          <motion.div 
            animate={{ x: parallaxCoords.x, y: parallaxCoords.y }}
            transition={{ type: 'easeOut', duration: 0.5 }}
            className="lg:col-span-5 relative w-full max-w-md mx-auto aspect-square flex items-center justify-center z-10"
          >
            {/* Mockup Frame */}
            <div className="w-full bg-bg-surface border border-border-subtle rounded-2xl shadow-2xl p-4 space-y-4 glass-panel scale-95 md:scale-100">
              
              {/* Mock Header */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-primary">Ecology 101 Lecture</span>
                </div>
                <Badge variant="language">Spanish Subtitles</Badge>
              </div>

              {/* Mock Captions */}
              <div className="bg-black/30 rounded-xl p-4 h-40 overflow-hidden space-y-3">
                <p className="text-xs text-text-secondary/50 font-normal">
                  In our last class we touched upon ecosystems. Today we explore biodiversity...
                </p>
                <p className="text-sm text-text-primary font-bold">
                  The mitochondria acts as the power generators of the cell, converting oxygen...
                </p>
                <p className="text-xs text-accent-coral italic">
                  Las mitocondrias actúan como los generadores de energía de la célula, convirtiendo oxígeno...
                </p>
              </div>

              {/* Mock AI summary */}
              <div className="bg-bg-elevated/80 border border-border-subtle rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-accent-coral">
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">AI Instant Summary</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 bg-text-muted/20 rounded w-full" />
                  <div className="h-2 bg-text-muted/20 rounded w-[85%]" />
                </div>
              </div>
            </div>

            {/* Floating Orbs */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-accent-coral/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-accent-coral/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          </motion.div>
        </div>
      </section>

      {/* Waveform SVG Divider */}
      <div className="w-full overflow-hidden shrink-0 pointer-events-none relative h-20 -mt-10">
        <svg className="w-full h-full text-accent-coral/15" viewBox="0 0 1440 100" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,50 C120,80 240,20 360,50 C480,80 600,20 720,50 C840,80 960,20 1080,50 C1200,80 1320,20 1440,50 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* Flagship Avatar Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-border-subtle/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual 3D avatar mockup box */}
          <div className="lg:col-span-5 relative bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-violet-500/20 rounded-2xl p-6 overflow-hidden flex flex-col items-center justify-center min-h-[300px] shadow-2xl">
            {/* Glowing neon background circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
            
            {/* Floating particle elements */}
            <div className="absolute top-6 left-8 w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
            <div className="absolute bottom-12 right-12 w-3.5 h-3.5 bg-blue-400 rounded-full animate-pulse" />

            {/* Stylized Avatar Mockup Silhouette */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-violet-500/20 border-2 border-violet-400 flex items-center justify-center shadow-lg shadow-violet-500/20 animate-pulse">
                <Accessibility className="w-10 h-10 text-violet-400" />
              </div>
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/25">Live 3D Rendering</span>
                <p className="text-sm font-bold text-white mt-1">Procedural Animation System</p>
              </div>
            </div>
          </div>

          {/* Text and Description */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest text-violet-400 bg-violet-400/10 border border-violet-400/20 uppercase rounded-full">
              Flagship Innovation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display leading-tight">
              Not Just Captions. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Visual Sign Language Communication.</span>
            </h2>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl leading-relaxed mx-auto lg:mx-0">
              Transforming classroom speech into real-time visual communication through AI-powered sign language avatars. 
              Provides deaf and hard-of-hearing students with rich, human-like animated gestures synced with automated subtitles.
            </p>
            <div className="pt-2 flex justify-center lg:justify-start">
              <Button 
                onClick={() => navigate('/avatar')}
                variant="primary"
                size="md"
                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold px-6 border-none shadow-lg shadow-violet-600/10"
              >
                Launch Live Avatar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats counter section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-border-subtle/40 bg-black/10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-accent-coral">Educational Disparity Metrics</h2>
          <p className="text-xs text-text-secondary mt-1">Understanding the challenges faced by students in the deaf community</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard value={466} suffix="M+" label="Deaf & Hard-of-Hearing" icon={HardDrive} />
          <StatsCard value={70} suffix="%" label="Miss Classroom Content" icon={Mic} />
          <StatsCard value={3} suffix="x" label="Higher Dropout Risk" icon={BookOpen} />
          <StatsCard value={50} suffix="+" label="Languages Supported" icon={Languages} />
        </div>
      </section>

      {/* How it works section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold font-display">How Signify AI Works</h2>
          <p className="text-sm text-text-secondary mt-2">A seamless pipeline bridging the sound gap in educational rooms</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="glass-panel p-6 rounded-xl space-y-3 h-full relative z-10 bg-bg-surface/60">
                <span className="text-accent-coral font-bold font-display text-2xl">{step.num}</span>
                <h3 className="font-bold text-text-primary text-sm font-display">{step.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
              
              {/* Dotted connecting arrow (Desktop only) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-4 z-0 text-accent-coral/40 font-bold">
                  <ChevronRight className="w-5 h-5 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-border-subtle/30 bg-black/10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold font-display">Accessibility Features</h2>
          <p className="text-sm text-text-secondary mt-2">Comprehensive accessibility tools designed to elevate classroom experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="glass-panel p-6 rounded-xl glass-card-hover space-y-4"
              >
                <div className="p-3 bg-accent-coral/10 text-accent-coral rounded-lg border border-accent-coral/20 w-fit">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-text-primary font-display">{feat.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack Marquee Section */}
      <section className="py-12 border-t border-b border-border-subtle bg-bg-surface overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-surface to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling wrapper */}
        <div className="flex w-[200%] gap-12 items-center animate-[marquee_25s_linear_infinite] md:animate-[marquee_35s_linear_infinite] whitespace-nowrap">
          {/* Repeat text twice for infinite effect */}
          {[...marqueeTechnologies, ...marqueeTechnologies].map((tech, idx) => (
            <div key={idx} className="flex items-center gap-3 text-text-secondary text-xs font-semibold uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-accent-coral" />
              <span>{tech}</span>
            </div>
          ))}
        </div>

        {/* Custom CSS keyframe injected directly for simplicity */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}} />
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary relative z-10">
        <div>
          Team <strong className="text-text-primary">Unstoppable</strong> &copy; {new Date().getFullYear()} Signify AI
        </div>
        <div className="flex items-center gap-4">
          <span className="px-2.5 py-1 rounded bg-accent-coral/10 text-accent-coral border border-accent-coral/25">
            GitHub DevDays Finalist
          </span>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-text-primary transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>Repository</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
