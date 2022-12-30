export const lifecycleNameMap: Map<string, string | undefined> = new Map([
  ['beforeCreate', undefined],
  ['created', undefined],
  ['beforeMount', 'onBeforeMount'],
  ['mounted', 'onMounted'],
  ['beforeUpdate', 'onBeforeUpdate'],
  ['updated', 'onUpdated'],
  ['beforeUnmount', 'onBeforeUnmount'],
  ['beforeDestroy', 'onBeforeUnmount'],
  ['destroyed', 'onUnmounted'],
  ['errorCaptured', 'onErrorCaptured'],
  ['renderTracked', 'onRenderTracked'],
  ['renderTriggered', 'onRenderTriggered'],
]);
