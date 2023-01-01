import { test, expect } from 'vitest';
import fs from 'fs';
import { Project, ScriptTarget, SyntaxKind, Node } from 'ts-morph';
import { parse } from '@vue/compiler-sfc';
import { watchConverter } from './watchConverter';

test('convert watch', () => {
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

  const watchNode = options
    ?.getProperties()
    .find((x) => Node.isPropertyAssignment(x) && x.getName() === 'watch');

  const props = watchConverter(watchNode!);
  expect(props).toEqual([
    {
      use: 'watch',
      expression: "watch(age, () => {\n      console.log('watch');\n    })",
    },
    {
      use: 'watch',
      expression:
        'watch(someObject, (newValue,oldValue) => {\n' +
        '        console.log(newValue, oldValue);\n' +
        '      }, {"deep":true} )',
    },
  ]);
});
