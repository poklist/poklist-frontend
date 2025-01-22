const { transform } = require('typescript');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontSize: {
        h1: ['1.625rem', '2.194rem'],
        h2: ['1.063rem', '1.541rem'],
        t1: ['0.938rem', '1.359rem'],
        t2: ['0.813rem', '1.178rem'],
        t3: ['0.625rem', '0.906rem'],
      },
      colors: {
        'black-text-01': '#1F1F1F',
        'black-icon-02': '#484848',
        'black-gray-03': '#828282',
        'black-tint-04': '#C4C2C2',
        white: '#fff',
        'yellow-bright-01': '#F2FF00',
        'green-bright-01': '#89F3E7',
        'gray-storm-01': '#9B988D',
        'gray-02': '#E2DFD6',
        'gray-main-03': '#F1F1F1',
        'gray-sub-04': '#F8F7F4',
        'gray-note-05': '#F6F6F6',
        'red-warning-01': '#EB6052',
        'bright-green': '#89F3E7',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          tint: 'hsl(var(--secondary-tint))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'swipe-down': {
          from: { transform: 'translateY(-100px)' },
          to: { transform: 'translateY(var(--radix-toast-swipe-end-y))' },
        },
        'swipe-up': {
          from: { transform: 'translateY(var(--radix-toast-swipe-end-y))' },
          to: { transform: 'translateY(-100px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'show-mask': 'enter-from ease-in-out both',
        'hide-mask': 'leave-to ease-in-out both',
        'swipe-down': 'swipe-down 0.5s ease-in-out',
        'swipe-up': 'swipe-up 1s ease-in-out',
      },
      fontFamily: {
        inter: 'Inter, sans-serif',
      },
      backgroundImage: {
        'user-page-grid': "url('tile.jpeg')",
      },
      backgroundSize: {
        '0.3%': '0.3%',
        '1%': '1%',
      },
      width: {
        'mobile-max': '430px',
      },
      maxWidth: {
        'mobile-max': '430px',
      },
      letterSpacing: {
        '-1.1%': '-1.1%',
      },
      textStrokeWidth: {
        white: '-1px',
      },
      textStrokeColor: {
        white: '#FFFFFF',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-stroke-white': {
          '-webkit-text-stroke-width': '1px',
          '-webkit-text-stroke-color': '#FFFFFF',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
