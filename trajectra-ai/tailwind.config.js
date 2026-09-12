/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070b14',
        surface: '#0d1527',
        'surface-border': '#1b2a4a',
        'panel-dark': '#0a101f',
        primary: {
          50: '#e6f6ff',
          100: '#bae6ff',
          400: '#38bdf8',
          500: '#00f0ff',
          600: '#0284c7',
          900: '#0c4a6e',
        },
        accent: {
          cyan: '#00f0ff',
          blue: '#3b82f6',
          green: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#a855f7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'scanline': 'scanline 4s linear infinite',
        'radar-spin': 'radarSpin 4s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 5px rgba(0, 240, 255, 0.4), 0 0 10px rgba(0, 240, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.8), 0 0 30px rgba(0, 240, 255, 0.4)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        radarSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
