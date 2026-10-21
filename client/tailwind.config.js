/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        twin: {
          bg: '#090A10',
          panel: '#10121C',
          card: '#161928',
          hover: '#1E2238',
          border: 'rgba(255, 255, 255, 0.09)',
          borderSubtle: 'rgba(255, 255, 255, 0.05)',
          violet: '#8B5CF6',
          emerald: '#10B981',
          cyan: '#06B6D4',
          amber: '#F59E0B',
          rose: '#EF4444',
          muted: '#8E9AAF',
          text: '#F3F4F6',
          textDim: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'aurora-glow': 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 80%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
