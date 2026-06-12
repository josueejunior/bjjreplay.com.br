import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050a14',
        surface: {
          DEFAULT: '#0c1424',
          raised: '#111c32',
          hover: '#162033',
        },
        bjj: {
          white: '#f8fafc',
          blue: '#1e3a8a',
          'blue-light': '#2563eb',
          'blue-dark': '#0f172a',
          black: '#0a0a0a',
          red: '#dc2626',
          green: '#22ff88',
        },
        neon: {
          DEFAULT: 'var(--neon, #dc2626)',
          dim: 'var(--neon-dim, #b91c1c)',
          faint: 'var(--neon-faint, rgba(220, 38, 38, 0.14))',
        },
        metallic: '#c0c0c0',
      },
      boxShadow: {
        glow: '0 0 20px var(--neon-glow)',
        'glow-strong': '0 0 32px var(--neon-glow-strong)',
      },
      backgroundImage: {
        'metallic-gradient': 'linear-gradient(135deg, #e4e4e7 0%, #71717a 50%, #d4d4d8 100%)',
        'neon-gradient': 'var(--belt-gradient, linear-gradient(135deg, #f8fafc 0%, #ef4444 45%, #dc2626 100%))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(220, 38, 38, 0.15)' },
          '50%': { boxShadow: '0 0 24px rgba(220, 38, 38, 0.3)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
