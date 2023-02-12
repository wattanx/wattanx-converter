// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "wattanx converter",
      meta: [
        {
          name: "description",
          content: "wattanx converter provides a variety of vue converters.",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/cat_dot.png",
        },
      ],
    },
  },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ["@nuxt/content"],
  content: {
    highlight: {
      theme: "slack-dark",
    },
  },
});
