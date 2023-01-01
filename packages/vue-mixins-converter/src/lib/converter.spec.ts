import { convertSrc } from './converter';
import { it, expect } from 'vitest';
import fs from 'fs';

it('convertSrc', () => {
  const mixin = fs.readFileSync('src/mixins/MixinSample.js').toString('utf-8');

  const converted = convertSrc({ input: mixin, fileName: 'useMixins' });

  expect(converted).toMatchSnapshot();
});
