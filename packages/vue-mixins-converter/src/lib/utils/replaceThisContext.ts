const contextProps = [
  'attrs',
  'slots',
  'parent',
  'root',
  'listeners',
  'refs',
  'emit',
];

export const replaceThisContext = (
  str: string,
  refNameMap: Map<string, true>
) => {
  return str
    .replace(/this\.\$(\w+)/g, (_, p1) => {
      if (contextProps.includes(p1)) return `ctx.${p1}`;
      return `ctx.root.$${p1}`;
    })
    .replace(/this\.([\w-]+)/g, (_, p1) => {
      return refNameMap.has(p1) ? `${p1}.value` : p1;
    });
};
