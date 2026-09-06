import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        clinic: {
          ink: '#172026',
          blue: '#285e8e',
          teal: '#18746f',
          green: '#2f7d52',
          amber: '#b7791f',
          surface: '#f6f8f9',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
