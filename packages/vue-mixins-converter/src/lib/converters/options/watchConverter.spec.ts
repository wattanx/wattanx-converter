import { test, expect } from 'vitest';
import fs from 'fs';
import { Project, ScriptTarget, SyntaxKind, Node } from 'ts-morph';
import { watchConverter } from './watchConverter';

test('convert watch', () => {
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
