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
