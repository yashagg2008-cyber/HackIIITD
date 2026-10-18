/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#0D9488',
          emerald: '#10B981',
          slate: '#0F172A',
          red: '#EF4444',
          amber: '#F59E0B'
        }
      }
    },
  },
  plugins: [],
}
