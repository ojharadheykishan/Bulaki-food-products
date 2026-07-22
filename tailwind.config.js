/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          maroon: '#800000',
          crimson: '#8B0000',
          gold: '#D4AF37',
          goldLight: '#FFD700',
          cream: '#FFFDD0',
          ivory: '#FAF8F5',
          forest: '#1B4D3E',
        },
        primary: {
          50: '#fdf2f2',
          100: '#fce8e8',
          200: '#f9cfcf',
          300: '#f49a9a',
          400: '#ec5f5f',
          500: '#df2828',
          600: '#c81f1f',
          700: '#a81919',
          800: '#8B0000',
          900: '#751818',
          950: '#450909',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#D4AF37',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        background: '#FAF8F5',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
