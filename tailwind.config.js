/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#09111f',
          900: '#101827',
          800: '#172033',
          700: '#253149',
        },
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        mint: {
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
        },
        coral: {
          300: '#fda4af',
          400: '#fb7185',
        },
        purple: {
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },
      },
      boxShadow: {
        glow: '0 24px 80px rgba(6, 182, 212, 0.24)',
      },
      backgroundImage: {
        grid:
          'linear-gradient(rgba(8,145,178,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(8,145,178,.12) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
