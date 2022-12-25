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
