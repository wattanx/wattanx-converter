import { getInitializerProps } from './../lib/helper';
import { convertOptions } from './../lib/converters/options/optionsConverter';
import { convertSrc } from './../lib/converter';
import { it, expect } from 'vitest';
import fs from 'fs';
import { ts, Project, ScriptTarget, SyntaxKind, Node } from 'ts-morph';

const project = new Project({
  compilerOptions: { target: ScriptTarget.Latest },
});

it('convertSrc', () => {
  const mixin = fs.readFileSync('src/mixins/MixinSample.js').toString('utf-8');

  const converted = convertSrc({ input: mixin, fileName: 'useMixins' });

  expect(converted).toMatchSnapshot();
});

it('getInitializerProps', () => {
  const mixin = fs.readFileSync('src/mixins/MixinSample.js').toString('utf-8');
  const sourceFile = project.createSourceFile('src.tsx', mixin);
  const exportAssignNode = sourceFile.getFirstChildByKind(
    SyntaxKind.ExportAssignment
  );
  const objectNode = exportAssignNode?.getFirstChildByKindOrThrow(
    SyntaxKind.ObjectLiteralExpression
  );
  const props = objectNode?.getProperty('props');
  const data = objectNode?.getProperty('data');
  const computed = objectNode?.getProperty('computed');

  const methods = objectNode
    ?.getPropertyOrThrow('methods')
    .getFirstChildByKind(SyntaxKind.ObjectLiteralExpression);
  methods?.forEachChild((node) => {
    console.log(node.getKindName());
  });
  // methods.map((x) => {
  //   const spread = x.getProperty(
  //     (p) => p.getKind() === SyntaxKind.SpreadAssignment
  //   );
  // });
});
