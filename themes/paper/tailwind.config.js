/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./layouts/**/*.{html,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        'e23e57': '#e23e57',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
