/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep institutional navy — the "Oxford blue" equivalent of the reference.
        navy: {
          950: '#080f24',
          900: '#0b1531',
          800: '#0f1d44',
          700: '#16295f',
          600: '#1f3a80',
          500: '#2b4ea0',
        },
        // Warm academic gold used for accents/highlights.
        gold: {
          600: '#b7893f',
          500: '#c8a15a',
          400: '#d9bd83',
          300: '#e4cfa5',
          200: '#efe2c6',
        },
        cream: '#f6f4ef',
        ink: '#0e0e12',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
      },
      maxWidth: {
        wrap: '1200px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};
