/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1440px",
      },
      fontSize: {
        1: "14px",
        2: "16px",
        3: "18px",
        4: "24px",
        5: "28px",
        6: "32px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "15px",
          sm: "20px",
          lg: "40px",
          xl: "60px",
        },
      },
    },
  },
  plugins: [],
};
