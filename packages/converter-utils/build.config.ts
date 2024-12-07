import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [{ input: 'src/index.ts' }],
  externals: ['typescript', 'ts-morph'],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
});
