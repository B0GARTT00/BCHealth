import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brokenshire: {
          50: '#effaf5',
          100: '#d8f3e6',
          200: '#b3e7d0',
          300: '#7dd4b2',
          400: '#45b88f',
          500: '#159873',
          600: '#006a4e',
          700: '#005940',
          800: '#064b39',
          900: '#053d30',
        },
        medical: {
          50: '#f8fafb',
          100: '#f1f5f4',
          200: '#e2e8e6',
          300: '#cbd5d1',
          400: '#94a39d',
          500: '#64736d',
          600: '#47554f',
          700: '#34413c',
          800: '#1f2b27',
          900: '#111916',
        },
        success: { 50: '#ecfdf5', 100: '#d1fae5', 600: '#059669', 700: '#047857' },
        warning: { 50: '#fffbeb', 100: '#fef3c7', 600: '#d97706', 700: '#b45309' },
        danger: { 50: '#fff1f2', 100: '#ffe4e6', 600: '#e11d48', 700: '#be123c' },
        clinic: {
          ink: '#111916',
          blue: '#006a4e',
          teal: '#006a4e',
          green: '#059669',
          amber: '#d97706',
          surface: '#f8fafb',
        },
      },
    },
    boxShadow: { clinic: '0 1px 3px rgba(15, 23, 42, 0.08)' },
    borderRadius: { clinic: '0.75rem' },
  },
  plugins: [],
} satisfies Config;
