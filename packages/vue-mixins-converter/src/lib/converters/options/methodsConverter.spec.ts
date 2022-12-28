import { test, expect } from 'vitest';
import fs from 'fs';
import { Project, ScriptTarget, SyntaxKind, Node } from 'ts-morph';
import { _methodsConverter } from './methodsConverter';

test('convert methods', () => {
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

  const methodsNode = options
    ?.getProperties()
    .find((x) => Node.isPropertyAssignment(x) && x.getName() === 'methods');

  const props = _methodsConverter(methodsNode!);
  expect(props).toEqual([
    {
      expression: "const setUser = () => store.dispatch('user/setUser')",
      returnNames: ['setUser'],
    },
    {
      returnNames: ['getInfo'],
      expression:
        'const getInfo = async() =>{\n' +
        "      await fetch('https://www.google.com/');\n" +
        '    }',
    },
  ]);
});

test('convert methods ts', () => {
  const mixin = fs
    .readFileSync('src/mixins/MixinSample.ts.txt')
    .toString('utf-8');

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

  const methodsNode = options
    ?.getProperties()
    .find((x) => Node.isPropertyAssignment(x) && x.getName() === 'methods');

  const props = _methodsConverter(methodsNode!);
  expect(props).toEqual([
    {
      expression: "const setUser = () => store.dispatch('user/setUser')",
      returnNames: ['setUser'],
    },
    {
      returnNames: ['getInfo'],
      expression:
        'const getInfo = async(): Promise<void> =>{\n' +
        "      await fetch('https://www.google.com/');\n" +
        '    }',
    },
  ]);
});
