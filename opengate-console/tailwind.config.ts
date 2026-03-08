import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0D1B2A', light: '#1a2e44' },
        cyan: { DEFAULT: '#00B4D8', light: '#0dcfef' },
      },
    },
  },
  plugins: [],
};
export default config;
