import { create } from 'zustand';

const getLocalStorage = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  } catch (e) {
    return defaultValue;
  }
};

export const useSettingsStore = create((set) => ({
  targetLanguage: getLocalStorage('signify-target-lang', 'es'),
  autoTranslate: getLocalStorage('signify-auto-translate', false),
  autoSummarize: getLocalStorage('signify-auto-summarize', false),
  captionFontSize: getLocalStorage('signify-font-size', 'lg'), // sm, md, lg, xl, 2xl
  reduceMotion: getLocalStorage('signify-reduce-motion', false),
  groqApiKey: getLocalStorage('signify-groq-key', ''),
  captionStyle: getLocalStorage('signify-caption-style', 'standard'), // standard | large | contrast
  bgOpacity: Number(getLocalStorage('signify-bg-opacity', 20)),
  lineSpacing: getLocalStorage('signify-line-spacing', 'relaxed'), // tight | normal | relaxed | loose

  actions: {
    setTargetLanguage: (lang) => {
      localStorage.setItem('signify-target-lang', lang);
      set({ targetLanguage: lang });
    },
    toggleAutoTranslate: () => set((state) => {
      const newVal = !state.autoTranslate;
      localStorage.setItem('signify-auto-translate', String(newVal));
      return { autoTranslate: newVal };
    }),
    toggleAutoSummarize: () => set((state) => {
      const newVal = !state.autoSummarize;
      localStorage.setItem('signify-auto-summarize', String(newVal));
      return { autoSummarize: newVal };
    }),
    setCaptionFontSize: (size) => {
      localStorage.setItem('signify-font-size', size);
      set({ captionFontSize: size });
    },
    toggleReduceMotion: () => set((state) => {
      const newVal = !state.reduceMotion;
      localStorage.setItem('signify-reduce-motion', String(newVal));
      return { reduceMotion: newVal };
    }),
    setApiKey: (key) => {
      localStorage.setItem('signify-groq-key', key);
      set({ groqApiKey: key });
    },
    setCaptionStyle: (style) => {
      localStorage.setItem('signify-caption-style', style);
      set({ captionStyle: style });
    },
    setBgOpacity: (opacity) => {
      localStorage.setItem('signify-bg-opacity', String(opacity));
      set({ bgOpacity: opacity });
    },
    setLineSpacing: (spacing) => {
      localStorage.setItem('signify-line-spacing', spacing);
      set({ lineSpacing: spacing });
    }
  }
}));
