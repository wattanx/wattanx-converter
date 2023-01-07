import { test, expect } from 'vitest';
import { getSetupStatements } from './getSetupStatement';

test('get setup statement', () => {
  const output = getSetupStatements([
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
  ]);

  expect(output).toEqual([
    'const { age } = toRefs(props)',
    "const firstName = ref('first')",
    "const lastName = ref('last')",
    'const name = computed(() => store.state.user.name)',
    'const age = computed(() => store.state.user.age)',
    "const name = computed(() => store.getters['user/name'])",
    "const age = computed(() => store.getters['user/age'])",
    'const fullName = computed(() => {\n' +
      '      return firstName.value + lastName.value;\n' +
      '    })',
    "const setUser = () => store.dispatch('user/setUser')",
    'const getInfo = async() =>{\n' +
      "      await fetch('https://www.google.com/');\n" +
      '    }',
    "watch(age, () => {\n      console.log('watch');\n    })",
    'watch(someObject, (newValue,oldValue) => {\n' +
      '        console.log(newValue, oldValue);\n' +
      '      }, {"deep":true} )',
    "onMounted(() =>{\n    console.log('mounted');\n  })",
    'return {firstName,lastName,name,age,name,age,fullName,setUser,getInfo}',
  ]);
});
