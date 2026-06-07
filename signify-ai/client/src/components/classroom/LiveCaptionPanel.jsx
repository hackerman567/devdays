import React, { useEffect, useRef } from 'react';
import { useCaptionStore } from '../../store/useCaptionStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import Badge from '../ui/Badge';
import { Mic, MicOff } from 'lucide-react';

export default function LiveCaptionPanel() {
  const { finalTranscript, interimText, translatedLines, isListening } = useCaptionStore();
  const { 
    captionFontSize, 
    autoTranslate, 
    targetLanguage,
    captionStyle,
    bgOpacity,
    lineSpacing
  } = useSettingsStore();
  const scrollContainerRef = useRef(null);

  // Map settings font-size key to Tailwind styles
  const fontSizes = {
    md: 'text-2xl md:text-3xl leading-relaxed',
    lg: 'text-3xl md:text-4xl leading-relaxed',
    xl: 'text-4xl md:text-5xl leading-relaxed',
    '2xl': 'text-5xl md:text-6xl leading-relaxed'
  };

  // Map line spacings to space utilities
  const spacingClasses = {
    tight: 'space-y-3',
    normal: 'space-y-4',
    relaxed: 'space-y-6',
    loose: 'space-y-8'
  };

  const currentFontSizeClass = fontSizes[captionFontSize] || fontSizes.lg;
  const currentSpacingClass = spacingClasses[lineSpacing] || spacingClasses.relaxed;
  
  // High contrast adjustments
  const isHighContrast = captionStyle === 'contrast';
  const textPrimaryColor = isHighContrast ? 'text-white font-extrabold tracking-wide' : 'text-text-primary';
  const textSecondaryColor = isHighContrast ? 'text-gray-300 font-medium' : 'text-text-secondary/60';
  const textTranslationColor = isHighContrast ? 'text-yellow-400 font-bold' : 'text-accent-coral-soft/85';

  // Auto-scroll to the bottom of caption stream
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [finalTranscript, interimText, translatedLines]);

  return (
    <div className="flex flex-col h-full bg-bg-surface border border-border-subtle rounded-xl overflow-hidden relative">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-bg-surface/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-text-primary text-base font-display">Live Lecture Captioning</h2>
          {isListening && <Badge variant="live">Live</Badge>}
        </div>

        {/* Waveform Visualizer */}
        <div className="flex items-end gap-[3px] h-6 px-2">
          {[0.2, 0.5, 0.3, 0.8, 0.4, 0.6, 0.9, 0.3, 0.7, 0.5, 0.2].map((delay, idx) => (
            <div
              key={idx}
              className={`w-[3px] bg-accent-coral rounded-full origin-bottom ${
                isListening ? 'animate-waveform' : 'h-1.5'
              }`}
              style={{
                height: isListening ? '100%' : '6px',
                animationDelay: `${delay}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Caption Stream Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 md:p-8 min-h-[350px] transition-all"
        style={{ backgroundColor: `rgba(0, 0, 0, ${bgOpacity / 100})` }}
      >
        {finalTranscript.length === 0 && !interimText ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <div className={`p-4 rounded-full border bg-bg-elevated ${isListening ? 'border-accent-coral/20 text-accent-coral' : 'border-border-subtle text-text-muted'}`}>
              {isListening ? (
                <Mic className="w-8 h-8 animate-pulse" />
              ) : (
                <MicOff className="w-8 h-8" />
              )}
            </div>
            <div>
              <p className="text-text-primary font-bold">No speech detected yet</p>
              <p className="text-xs text-text-secondary mt-1">
                {isListening 
                  ? "Listening through your microphone... Speak or start the demo to stream captions."
                  : "Click 'Start Session' or 'Try Demo' in the controls panel to activate transcription."}
              </p>
            </div>
          </div>
        ) : (
          <div className={currentSpacingClass}>
            {finalTranscript.map((line, index) => {
              const isLast = index === finalTranscript.length - 1 && !interimText;
              return (
                <div key={index} className="space-y-2 border-l-2 border-transparent hover:border-accent-coral/10 pl-3 transition-all">
                  {/* Original Sentence */}
                  <p className={`font-semibold tracking-wide transition-colors duration-300 ${currentFontSizeClass} ${
                    isLast ? textPrimaryColor : textSecondaryColor
                  }`}>
                    {line}
                  </p>
                  
                  {/* Translated Sentence */}
                  {autoTranslate && translatedLines[index] && (
                    <p className={`italic ${textTranslationColor} ${
                      currentFontSizeClass.replace('text-', 'text-base md:text-') // scale down translation size slightly
                    }`}>
                      {translatedLines[index]}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Interim Partial Sentence */}
            {interimText && (
              <div className="space-y-2 pl-3">
                <p className={`font-semibold italic tracking-wide text-text-secondary/40 select-none ${currentFontSizeClass}`}>
                  {interimText}...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
