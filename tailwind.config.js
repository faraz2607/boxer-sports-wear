/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          5: "#F6FFDE",
          15: "#E3F2C1",
          25: "#C9DBB2",
          35: "#AAC8A7",
        },
        dark: {
          5: "#F4EEE0",
          15: "#6D5D6E",
          25: "#4F4557",
          35: "#393646",
        }
      }
    },
  },
  plugins: [],
}

