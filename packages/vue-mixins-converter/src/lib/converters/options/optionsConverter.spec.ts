import { test, expect } from 'vitest';
import fs from 'fs';
import { Project, ScriptTarget } from 'ts-morph';
import { optionsConverter } from './optionsConverter';

test('convert options', () => {
  const mixin = fs.readFileSync('src/mixins/MixinSample.js').toString('utf-8');

  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile('s.tsx', mixin);

  const options = optionsConverter(sourceFile);
  expect(options).toEqual({
    setupProps: [
      {
        use: 'toRefs',
        expression: 'const { age } = toRefs(props)',
        returnNames: ['age'],
      },
      {
        use: 'ref',
        expression: "const firstName = ref('first')",
        returnNames: ['firstName'],
      },
      {
        use: 'ref',
        expression: "const lastName = ref('last')",
        returnNames: ['lastName'],
      },
      {
        use: 'computed',
        expression: 'const name = computed(() => store.state.user.name)',
        returnNames: ['name'],
      },
      {
        use: 'computed',
        expression: 'const age = computed(() => store.state.user.age)',
        returnNames: ['age'],
      },
      {
        use: 'computed',
        expression: "const name = computed(() => store.getters['user/name'])",
        returnNames: ['name'],
      },
      {
        use: 'computed',
        expression: "const age = computed(() => store.getters['user/age'])",
        returnNames: ['age'],
      },
      {
        use: 'computed',
        expression:
          'const fullName = computed(() => {\n' +
          '      return this.firstName + this.lastName;\n' +
          '    })',
        returnNames: ['fullName'],
      },
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
      {
        use: 'onMounted',
        expression: "onMounted(() =>{\n    console.log('mounted');\n  })",
      },
    ],
    propNames: ['age'],
    otherProps: expect.any(Object),
  });
});
