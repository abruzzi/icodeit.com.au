/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./layouts/**/*.{html,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: '#e23e57',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
