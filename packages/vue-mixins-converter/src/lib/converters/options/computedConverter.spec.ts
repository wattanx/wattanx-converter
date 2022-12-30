import { test, expect } from 'vitest';
import fs from 'fs';
import { Project, ScriptTarget, SyntaxKind, Node } from 'ts-morph';
import { computedConverter } from './computedConverter';

test('convert computed', () => {
  const mixin = fs.readFileSync('src/mixins/MixinSample.js').toString('utf-8');

  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile('s.tsx', mixin);

  const options = sourceFile.getDescendantsOfKind(
    SyntaxKind.ObjectLiteralExpression
  )[0];

  const computedNode = options
    ?.getProperties()
    .find((x) => Node.isPropertyAssignment(x) && x.getName() === 'computed');

  const props = computedConverter(computedNode!);
  expect(props).toEqual([
    {
      use: 'computed',
      expression: 'const name = computed(() => store.state.user.name)',
      returnNames: ['name'],
    },
    {
      use: 'computed',
      expression: 'const age = computed(() => store.state.user.age)',
      returnNames: ['age'],
    },
    {
      use: 'computed',
      expression: "const name = computed(() => store.getters['user/name'])",
      returnNames: ['name'],
    },
    {
      use: 'computed',
      expression: "const age = computed(() => store.getters['user/age'])",
      returnNames: ['age'],
    },
    {
      use: 'computed',
      expression:
        'const fullName = computed(() => {\n' +
        '      return this.firstName + this.lastName;\n' +
        '    })',
      returnNames: ['fullName'],
    },
  ]);
});
