import { test, expect } from 'vitest';
import fs from 'fs';
import { Project, ScriptTarget, SyntaxKind, Node } from 'ts-morph';
import { parse } from '@vue/compiler-sfc';
import { propsReader } from './propsReader';

test('convert props', () => {
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

  const propNode = options
    ?.getProperties()
    .find((x) => Node.isPropertyAssignment(x) && x.getName() === 'props');

  const props = propsReader(propNode!);
  expect(props).toEqual(['age']);
});
