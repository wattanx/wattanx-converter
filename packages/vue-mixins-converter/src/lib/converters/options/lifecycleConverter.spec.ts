import { test, expect } from 'vitest';
import fs from 'fs';
import { Project, ScriptTarget, SyntaxKind, Node } from 'ts-morph';
import { _lifecycleConverter } from './lifecycleConverter';
import { lifecycleNameMap } from '../../helper';

test('convert props', () => {
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

  const lifecycleNode = options
    ?.getProperties()
    .find(
      (x) => Node.isMethodDeclaration(x) && lifecycleNameMap.has(x.getName())
    );

  const props = _lifecycleConverter(lifecycleNode!);
  expect(props).toEqual([
    {
      use: 'onMounted',
      expression: "onMounted(() =>{\n    console.log('mounted');\n  })",
    },
  ]);
});
