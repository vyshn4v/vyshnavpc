/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/hbs-templates/**/*.hbs",
    "./src/public/js/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'Times', 'serif'],
        head: ['"Playfair Display"', 'Georgia', 'serif'], // For the massive masthead
      },
      colors: {
        primary: {
          DEFAULT: '#000000',
          hover: '#333333',
        },
        background: {
          DEFAULT: '#ffffff',
          card: '#ffffff',
          border: '#000000',
        },
        brand: {
          red: '#c92a2a', // Typical newspaper red for small tags
          blue: '#1e3a8a', // Typical newspaper blue
        }
      }
    },
  },
  plugins: [],
}
