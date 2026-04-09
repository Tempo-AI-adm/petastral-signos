/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0B0F1E',
        'navy-light': '#141929',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF6B35, #E91E8C)',
      }
    },
  },
  plugins: [],
}
