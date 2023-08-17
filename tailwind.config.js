/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./docs/**/*.{vue,js,ts,jsx,tsx}"],
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
      pink: {
        100: "#FFEAE7",
        200: "#FFD1CF",
        300: "#FFB7BA",
        400: "#FFA5B2",
        500: "#FF87A4",
        600: "#DB628B",
        700: "#B74476",
        800: "#932B62",
        900: "#7A1956",
      },
      blue: {
        100: "#DDFFFA",
        200: "#BCFFFB",
        300: "#9BFCFF",
        400: "#82F1FF",
        500: "#59E1FF",
        600: "#41B3DB",
        700: "#2C89B7",
        800: "#1C6393",
        900: "#11477A",
      },
      yellow: {
        100: "#FFFDE1",
        200: "#FFFAC3",
        300: "#FFF7A4",
        400: "#FFF48E",
        500: "#FFF069",
        600: "#DBCB4C",
        700: "#B7A734",
        800: "#938421",
        900: "#7A6B14",
      },
      orange: {
        500: "#FDBA74",
      },
      white: "#FFFFFF",
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
