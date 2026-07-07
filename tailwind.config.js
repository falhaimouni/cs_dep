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
        surface: {
          DEFAULT: '#ffffff',
          muted: '#fafafa',
          subtle: '#f4f4f5',
        },
        border: {
          DEFAULT: '#e4e4e7',
          strong: '#d4d4d8',
        },
        accent: {
          DEFAULT: '#0d9488',
          hover: '#0f766e',
          muted: '#ccfbf1',
          foreground: '#ffffff',
        },
        ink: {
          DEFAULT: '#18181b',
          secondary: '#52525b',
          tertiary: '#a1a1aa',
        },
      },
      borderRadius: {
        DEFAULT: '6px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
};
