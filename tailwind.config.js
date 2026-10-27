/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          violet: '#7657FF',
          pink: '#FF5DA2',
          tangerine: '#FF9F43',
          aqua: '#49DCC6',
          sunshine: '#FFE66D',
        },
        cinema: {
          bg: 'var(--cinema-bg)',
          surface: 'var(--cinema-surface)',
          elevated: 'var(--cinema-elevated)',
          border: 'var(--cinema-border)',
          text: 'var(--cinema-text)',
          muted: 'var(--cinema-muted)',
          subtle: 'var(--cinema-subtle)',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cinema-glow': '0 0 25px -5px rgba(118, 87, 255, 0.35)',
        'pink-glow': '0 0 25px -5px rgba(255, 93, 162, 0.35)',
        'tangerine-glow': '0 0 25px -5px rgba(255, 159, 67, 0.35)',
        'aqua-glow': '0 0 25px -5px rgba(73, 220, 198, 0.35)',
        'card-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
