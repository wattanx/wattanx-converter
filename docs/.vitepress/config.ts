import type { UserConfig, DefaultTheme } from "vitepress";

// https://vitepress.dev/reference/site-config
export default {
  title: "wattanx-converter",
  description: "wattanx-converter provides useful tools for Vue and Nuxt.",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        sizes: "any",
        href: "/wattanx-converter-icon.svg",
      },
    ],
    ["link", { rel: "apple-touch-icon", href: "/wattanx-converter-icon.png" }],
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
          {
            text: "Vue Pinia Converter",
            link: "/pinia-converter/index",
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
          {
            text: "Vue Pinia Converter",
            link: "/pinia-converter/index",
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
      { icon: "github", link: "https://github.com/wattanx/wattanx-converter" },
    ],
  },
  cleanUrls: true,
} satisfies UserConfig<DefaultTheme.Config>;
