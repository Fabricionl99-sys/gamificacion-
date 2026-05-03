import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: {
          subtle: 'rgba(255, 255, 255, 0.06)',
          DEFAULT: 'rgba(255, 255, 255, 0.10)',
          default: 'rgba(255, 255, 255, 0.10)',
          strong: 'rgba(255, 255, 255, 0.20)',
          accent: 'rgba(10, 247, 132, 0.3)',
          'accent-strong': '#0AF784',
        },
        bg: {
          primary: '#0A0E13',
          secondary: '#13181F',
          tertiary: '#1E252F',
          elevated: '#242C38',
          overlay: 'rgba(10, 14, 19, 0.85)',
        },
        accent: {
          DEFAULT: '#0AF784',
          hover: '#08D971',
          active: '#06B85F',
          subtle: 'rgba(10, 247, 132, 0.08)',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A8B5',
          tertiary: '#6B7380',
          disabled: '#3D434E',
        },
        success: '#0AF784',
        warning: '#FFB020',
        danger: '#FF4D6D',
        info: '#4D9FFF',
        streak: '#FF6B35',
        coins: '#FFB020',
        vip: {
          bronze: '#CD7F32',
          silver: '#B5D4F4',
          gold: '#FFD700',
          diamond: '#00D9FF',
        },
      },
      fontFamily: {
        urbanist: ['Urbanist', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['11px', { lineHeight: '1.4' }],
        sm: ['13px', { lineHeight: '1.5' }],
        base: ['14px', { lineHeight: '1.5' }],
        md: ['16px', { lineHeight: '1.5' }],
        lg: ['20px', { lineHeight: '1.3' }],
        xl: ['24px', { lineHeight: '1.2' }],
        '2xl': ['32px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '3xl': ['48px', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      screens: {
        xs: '390px',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
        md: '0 8px 24px rgba(0, 0, 0, 0.4)',
        lg: '0 16px 48px rgba(0, 0, 0, 0.5)',
        xl: '0 24px 64px rgba(0, 0, 0, 0.6)',
        glow: '0 0 20px rgba(10, 247, 132, 0.3)',
        'glow-strong': '0 0 32px rgba(10, 247, 132, 0.5)',
        'glow-intense': '0 0 48px rgba(10, 247, 132, 0.7)',
        card: '0 8px 24px rgba(0, 0, 0, 0.4)',
        modal: '0 24px 64px rgba(0, 0, 0, 0.6)',
      },
      backdropBlur: {
        xs: '4px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        scan: 'scan 4s ease-in-out infinite',
        'spin-decel': 'spin-decel 4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        'fade-in': 'fade-in 180ms ease-out',
        'modal-enter': 'modal-enter 200ms ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'modal-enter': {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 77, 109, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(255, 77, 109, 0)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'spin-decel': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(1280deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
