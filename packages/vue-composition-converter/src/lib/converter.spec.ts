import { convertSrc } from './converter';
import { it, expect } from 'vitest';
import fs from 'fs';
import { Project, ScriptTarget } from 'ts-morph';

const project = new Project({
  compilerOptions: { target: ScriptTarget.Latest },
});

it('convertSrc', () => {
  const mixin = fs.readFileSync('src/samples/OptionsApi.vue').toString('utf-8');

  const converted = convertSrc({ input: mixin });

  expect(converted).toMatchSnapshot();
});
