/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        brand: '#e23e57',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}