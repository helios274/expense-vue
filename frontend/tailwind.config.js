/** @type {import('tailwindcss').Config} */
// import {} from "./src/assets/images/home.jpeg"
const colors = require("tailwindcss/colors");
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        playpen: ["Playpen Sans", "cursive"],
      },
      backgroundImage: {
        home: "url('./src/assets/images/home1.jpeg')",
      },
      colors: {
        primary: "#FDF0F0",
        secondary: "#F1B4BB",
        tertiary: "#1F4172",
        quaternary: "#132043",
      },
    },
  },
  plugins: [],
};
