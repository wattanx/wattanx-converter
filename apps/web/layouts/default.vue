<script setup lang="ts">
const showSideNav = ref(false);
</script>

<template>
  <div>
    <Header @iconClick="showSideNav = !showSideNav" />
    <main class="flex flex-row">
      <Transition>
        <SideNav v-show="showSideNav" />
      </Transition>
      <slot />
    </main>
  </div>
</template>
<style scoped>
.v-enter-active {
  transition: all 0.1s ease-out;
}

.v-leave-active {
  transition: all 0.1s ease-out;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}
</style>
