/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "1440px",
      },
    },
    container: {
      center: true,
      padding: {
        lg: "20px",
        xl: "0px",
        "2xl": "0px",
      },
    },
  },
  plugins: [],
};
