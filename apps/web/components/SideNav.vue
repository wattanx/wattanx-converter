<template>
  <nav class="h-[100vh] w-60 bg-gray-900 px-1 shadow-md">
    <ul class="relative">
      <li class="relative">
        <NuxtLink
          class="flex h-12 items-center overflow-hidden text-ellipsis whitespace-nowrap rounded py-4 px-6 text-sm transition duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-900"
          to="/vue-composition-converter"
          >Vue Composition Converter</NuxtLink
        >
      </li>
      <li class="relative">
        <NuxtLink
          class="flex h-12 items-center overflow-hidden text-ellipsis whitespace-nowrap rounded py-4 px-6 text-sm transition duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-900"
          to="/vue-mixins-converter"
          >Vue Mixins Converter</NuxtLink
        >
      </li>
      <li class="relative">
        <NuxtLink
          class="flex h-12 items-center overflow-hidden text-ellipsis whitespace-nowrap rounded py-4 px-6 text-sm transition duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-900"
          to="/vue-script-setup-converter"
          >Vue Script Setup Converter</NuxtLink
        >
      </li>
    </ul>
  </nav>
</template>
