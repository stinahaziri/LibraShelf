/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f1ff',
          100: '#e9e3ff',
          500: '#6c4fe0',
          600: '#5a3fc4',
          700: '#4a339e',
        },
      },
    },
  },
  plugins: [],
};
