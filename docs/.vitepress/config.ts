import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "wattanx-converter",
  description: "wattanx-converter provides useful tools for Vue and Nuxt.",
  head: [
    ["link", { rel: "icon", type: "image/png", href: "/cat_dot.png" }],
    ["meta", { property: "og:title", content: "wattanx-converter" }],
    [
      "meta",
      {
        property: "og:description",
        content: "wattanx-converter provides useful tools for Vue and Nuxt.",
      },
    ],
    [
      "meta",
      {
        property: "og:image",
        content:
          "https://wattanx-converter.vercel.app/wattanx-converter_ogp.png",
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Converters",
        items: [
          {
            text: "Vue Composition Converter",
            link: "/vue-composition-converter/index",
          },
          {
            text: "Vue Mixins Converter",
            link: "/vue-mixins-converter/index",
          },
          {
            text: "Vue Script Setup Converter",
            link: "/vue-script-setup-converter/index",
          },
        ],
      },
      {
        text: "CLI",
        items: [
          {
            text: "Insert Emits Option",
            link: "/cli/insert-emits-option",
          },
          {
            text: "Nuxt Bridge Migration Tools",
            link: "/cli/nuxt-bridge-migration-tools",
          },
        ],
      },
    ],

    sidebar: [
      {
        text: "Converters",
        items: [
          {
            text: "Vue Composition Converter",
            link: "/vue-composition-converter/index",
          },
          {
            text: "Vue Mixins Converter",
            link: "/vue-mixins-converter/index",
          },
          {
            text: "Vue Script Setup Converter",
            link: "/vue-script-setup-converter/index",
          },
        ],
      },
      {
        text: "CLI",
        items: [
          { text: "Insert Emits Option", link: "/cli/insert-emits-option" },
          {
            text: "Nuxt Bridge Migration Tools",
            link: "/cli/nuxt-bridge-migration-tools",
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
