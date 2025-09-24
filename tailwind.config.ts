import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sda-blue': '#003087',
        'sda-white': '#FFFFFF',
        'sda-gray': '#F5F5F5',
      },
    },
  },
  plugins: [],
};
export default config;