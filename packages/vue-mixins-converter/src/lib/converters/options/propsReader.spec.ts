import { test, expect } from 'vitest';
import fs from 'fs';
import { Project, ScriptTarget, SyntaxKind, Node } from 'ts-morph';
import { propsReader } from './propsReader';

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

  const propNode = options
    ?.getProperties()
    .find((x) => Node.isPropertyAssignment(x) && x.getName() === 'props');

  const props = propsReader(propNode!);
  expect(props).toEqual(['age']);
});
