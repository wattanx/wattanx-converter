import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [{ input: 'src/index.ts', builder: 'rollup' }],
  declaration: true,
  externals: ['typescript', 'ts-morph'],
  rollup: {
    emitCJS: true,
  },
});
