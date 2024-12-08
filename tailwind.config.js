/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#8FD694',
          DEFAULT: '#4CAF50',
          dark: '#388E3C',
        },
      },
    },
  },
  plugins: [],
}