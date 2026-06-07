/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#0D0D0F',
        'bg-surface': '#141416',
        'bg-elevated': '#1C1C1F',
        'accent-coral': '#FF4D4D',
        'accent-coral-soft': '#FF6B6B',
        'text-primary': '#F5F0E8',
        'text-secondary': '#8A8A9A',
        'text-muted': '#4A4A5A',
        'border-subtle': 'rgba(255, 255, 255, 0.06)',
        'success': '#4ADE80',
        'warning': '#FB923C',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Syne"', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'waveform': 'waveform 1.2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 77, 77, 0)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(255, 77, 77, 0.3)' },
        },
        'waveform': {
          '0%, 100%': { transform: 'scaleY(0.2)' },
          '50%': { transform: 'scaleY(1)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
