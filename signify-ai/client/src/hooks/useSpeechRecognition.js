import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useCaptionStore } from '../store/useCaptionStore';
import { useSettingsStore } from '../store/useSettingsStore';

const SAMPLE_LECTURE_TEXT = 
  "Welcome class. Today we are going to study React components and how we manage local state using hooks. " +
  "A component is essentially a JavaScript function that returns user interface elements. " +
  "When you want to store information that changes over the course of a session, you use the useState hook. " +
  "Managing state correctly is essential to building highly interactive and accessible web applications. " +
  "Let's make sure our application respects keyboard focus and is compatible with screen readers. " +
  "This is vital for achieving WCAG 2.1 accessibility compliance. " +
  "Next, we will cover the useEffect hook which allows us to trigger side effects such as fetching data from a server. " +
  "When writing state variables, remember that updating state causes the component to re-render. " +
  "We must avoid unnecessary renders to maintain fast, smooth performances in our web apps. " +
  "Now let's open our text editors and begin coding this interactive dashboard step by step.";

export function useSpeechRecognition() {
  const { isListening, actions } = useCaptionStore();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const recognitionRef = useRef(null);
  const demoIntervalRef = useRef(null);
  const demoIndexRef = useRef(0);
  const currentSentenceRef = useRef([]);

  // Auto-restart behavior if listening is active
  const shouldRestartRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      console.log('Speech recognition started');
    };

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
        actions.setInterimText(interim);
      }

      if (final) {
        actions.addFinalLine(final);
      }
    };

    rec.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast.error('Microphone access denied. Please check site permissions.');
        actions.stopSession();
      } else if (event.error === 'no-speech') {
        // Safe to ignore, we want to keep listening
      } else {
        toast.error(`Microphone error: ${event.error}`);
      }
    };

    rec.onend = () => {
      console.log('Speech recognition ended');
      if (shouldRestartRef.current && isListening && !isDemoMode) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error('Failed to restart speech recognition:', err);
        }
      }
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [actions]);

  // Sync listening state with speech recognition or demo mode
  useEffect(() => {
    shouldRestartRef.current = isListening;

    if (isListening) {
      if (isDemoMode) {
        startDemoSimulation();
      } else {
        stopDemoSimulation();
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error('Error starting SpeechRecognition:', err);
          }
        } else {
          toast.error('Web Speech API not supported in this browser. Try Demo mode instead!');
          actions.stopSession();
        }
      }
    } else {
      if (isDemoMode) {
        stopDemoSimulation();
      } else if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }

    return () => {
      stopDemoSimulation();
    };
  }, [isListening, isDemoMode]);

  // Demo simulation function
  const startDemoSimulation = () => {
    stopDemoSimulation(); // Clean up any existing intervals
    actions.clearTranscript();
    demoIndexRef.current = 0;
    currentSentenceRef.current = [];
    
    const words = SAMPLE_LECTURE_TEXT.split(' ');
    
    demoIntervalRef.current = setInterval(() => {
      if (demoIndexRef.current >= words.length) {
        // Restart demo from beginning
        demoIndexRef.current = 0;
      }

      const word = words[demoIndexRef.current];
      currentSentenceRef.current.push(word);
      demoIndexRef.current++;

      // Create interim text preview
      const interimText = currentSentenceRef.current.join(' ');
      actions.setInterimText(interimText);

      // If word ends with a period, question mark, or exclamation, commit sentence
      if (word.endsWith('.') || word.endsWith('?') || word.endsWith('!')) {
        const sentence = currentSentenceRef.current.join(' ');
        actions.addFinalLine(sentence);
        currentSentenceRef.current = [];
      }
    }, 280); // Roughly 200 words per minute
  };

  const stopDemoSimulation = () => {
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
  };

  const toggleDemo = () => {
    if (!isListening) {
      setIsDemoMode(true);
      actions.startSession();
    } else {
      actions.stopSession();
      setIsDemoMode(false);
    }
  };

  const toggleListening = () => {
    if (isDemoMode) {
      setIsDemoMode(false);
    }
    if (isListening) {
      actions.stopSession();
    } else {
      actions.startSession();
    }
  };

  return {
    isListening,
    isDemoMode,
    toggleListening,
    toggleDemo,
    supported: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  };
}
