<script setup lang="ts">
import { useRoute } from "#app";
import Menu from "./menu/Menu.vue";
import MenuPortal from "./menu/MenuPortal.vue";
import ArrowUp from "./icons/ArrowUp.vue";
import Check from "./icons/Check.vue";
import { onClickOutside } from "@vueuse/core";

const menu = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Vue Composition Converter",
    href: "/vue-composition-converter",
  },
  {
    title: "Vue Mixins Converter",
    href: "/vue-mixins-converter",
  },
  {
    title: "Vue Script Setup Converter",
    href: "/vue-script-setup-converter",
  },
  {
    title: "Insert Emits Option",
    href: "/cli/insert-emits-option",
  },
  {
    title: "Nuxt Bridge Migration Tools",
    href: "/cli/nuxt-bridge-migration-tools",
  },
];

const route = useRoute();

const currentMenu = computed(
  () => menu.find((x) => x.href === route.path)?.title ?? "Home"
);

const openModal = ref(false);

const dataState = computed(() => (openModal.value ? "open" : "closed"));

const modalTarget = ref(null);

function closeModal() {
  openModal.value = false;
}

onClickOutside(modalTarget, closeModal);
</script>
<template>
  <header
    class="sticky top-[-1px] z-50 mx-auto flex h-14 justify-between bg-gray-900 px-4"
  >
    <div class="flex flex-row items-center space-x-2">
      <NuxtLink to="/">wattanx converter</NuxtLink>
      <p>/</p>
      <Menu id="menu-dropdown" class="group relative" :data-state="dataState">
        <div
          class="flex cursor-pointer flex-row items-center gap-2"
          @click="openModal = !openModal"
        >
          <button>{{ currentMenu }}</button>
          <ArrowUp class="group-data-[state=open]:rotate-180" />
        </div>

        <ClientOnly>
          <MenuPortal to="#menu-dropdown">
            <div
              class="absolute top-8 left-5 min-w-max rounded-md border-1 border-gray-600 bg-gray-800 p-2 shadow-md"
              v-if="openModal"
            >
              <div v-for="{ title, href } in menu" ref="modalTarget">
                <NuxtLink
                  class="flex flex-row items-center gap-3 rounded-md p-2 hover:bg-gray-600"
                  :to="href"
                  >{{ title }}<Check v-if="currentMenu === title"
                /></NuxtLink>
              </div>
            </div>
          </MenuPortal>
        </ClientOnly>
      </Menu>
    </div>
  </header>
</template>
