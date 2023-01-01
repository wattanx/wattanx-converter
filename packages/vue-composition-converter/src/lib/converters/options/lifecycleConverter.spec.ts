import { test, expect } from 'vitest';
import fs from 'fs';
import { Project, ScriptTarget, SyntaxKind, Node } from 'ts-morph';
import { parse } from '@vue/compiler-sfc';
import { lifecycleConverter } from './lifecycleConverter';
import { lifecycleNameMap } from '../../../constants/lifecycleNameMap';

test('convert lifecycle', () => {
  const file = fs.readFileSync('src/samples/OptionsApi.vue').toString('utf-8');

  const {
    descriptor: { script },
  } = parse(file);

  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile('s.tsx', script?.content ?? '');

  const options = sourceFile.getDescendantsOfKind(
    SyntaxKind.ObjectLiteralExpression
  )[0];

  const lifecycleNode = options
    ?.getProperties()
    .find(
      (x) => Node.isMethodDeclaration(x) && lifecycleNameMap.has(x.getName())
    );

  const props = lifecycleConverter(lifecycleNode!);
  expect(props).toEqual([
    {
      use: 'onMounted',
      expression: "onMounted(() =>{\n    console.log('mounted');\n  })",
    },
  ]);
});
