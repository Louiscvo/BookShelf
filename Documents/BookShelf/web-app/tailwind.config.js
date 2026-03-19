/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ac',
          300: '#f6ba77',
          400: '#f19340',
          500: '#ee7a1b',
          600: '#df6011',
          700: '#b94910',
          800: '#933a15',
          900: '#773214',
        }
      }
    },
  },
  plugins: [],
}
