---
outline: deep
layout: page
---

<script setup>
  import { defineAsyncComponent } from 'vue'
const View = defineAsyncComponent(() => import('./ConvertView.vue'))
</script>
<ClientOnly>
  <Suspense>
    <View />
    <template #fallback>
      Loading Example...
    </template>
  </Suspense>
</ClientOnly>
