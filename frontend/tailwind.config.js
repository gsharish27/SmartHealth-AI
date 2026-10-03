/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
      },
      colors: {
        border: '#E5EAF0',
        input: '#E5EAF0',
        ring: '#16A6A0',
        background: '#F6F8FB',
        foreground: '#172033',
        primary: {
          DEFAULT: '#123B66',
          foreground: '#FFFFFF',
          50: '#F0F4F8',
          100: '#D9E2EC',
          500: '#123B66',
          600: '#0E2E52',
          700: '#0A223D',
        },
        accent: {
          DEFAULT: '#16A6A0',
          foreground: '#FFFFFF',
          50: '#E6F6F5',
          100: '#C2ECE9',
          500: '#16A6A0',
          600: '#11847F',
          700: '#0D6460',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          foreground: '#172033',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#172033',
        },
        muted: {
          DEFAULT: '#F0F4F8',
          foreground: '#687386',
        },
        success: {
          DEFAULT: '#20A464',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#E5A11A',
          foreground: '#FFFFFF',
        },
        danger: {
          DEFAULT: '#D94A4A',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#D94A4A',
          foreground: '#FFFFFF',
        },
      },
      fontSize: {
        'page-title': ['32px', { lineHeight: '40px', fontWeight: '800' }],
        'section-title': ['20px', { lineHeight: '28px', fontWeight: '700' }],
        'card-title': ['15px', { lineHeight: '22px', fontWeight: '600' }],
        'body-text': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'secondary-text': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      boxShadow: {
        'card-sm': '0 1px 3px rgba(18, 59, 102, 0.04), 0 1px 2px rgba(18, 59, 102, 0.02)',
        'card-md': '0 4px 12px rgba(18, 59, 102, 0.06), 0 1px 3px rgba(18, 59, 102, 0.03)',
        'card-hover': '0 8px 24px rgba(18, 59, 102, 0.08), 0 2px 6px rgba(18, 59, 102, 0.04)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      }
    },
  },
  plugins: [],
}
