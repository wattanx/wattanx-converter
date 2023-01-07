import { Project, ScriptTarget, SyntaxKind } from 'ts-morph';
import { test, expect } from 'vitest';
import { getNodeByKind } from './getNodeByKind';

const script = `export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup() {
    const count = ref(0); 
  }
})`;

test('get node by kind', () => {
  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile('test.tsx', script);
  const propertyAssignment = getNodeByKind(
    sourceFile,
    SyntaxKind.PropertyAssignment
  );

  expect(propertyAssignment).not.toBeUndefined();
  expect(propertyAssignment?.getFullText()).toBe(`
  props: {
    name: {
      type: String,
      required: true
    }
  }`);
});
