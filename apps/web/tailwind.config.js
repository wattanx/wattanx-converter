/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    colors: {
      gray: {
        50: "#f9f9f9",
        100: "#f2f2f2",
        200: "#e9e9e9",
        300: "#d9d9d9",
        400: "#b6b6b6",
        500: "#969696",
        600: "#6d6d6d",
        700: "#2f3339",
        800: "#282b2f",
        900: "#1b1b1b",
      },
    },
    extend: {
      colors: {
        focused: "#63b3ed",
        borderColor: "#E2E8F0",
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
  plugins: [],
};
