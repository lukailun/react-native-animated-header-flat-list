const reactNative = require('@react-native/eslint-config');
const prettier = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier');
 
const globals = { 
  __DEV__: true,
  require: true,
  console: true
};

module.exports = [
  {
    ignores: ['node_modules/', 'lib/'],
    plugins: {
      prettier
    },
    languageOptions: {
      globals,
      parserOptions: reactNative.parserOptions
    },
    rules: {
      ...reactNative.rules,
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': ['error', {
        quoteProps: 'consistent',
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        useTabs: false
      }]
    }
  },
  eslintConfigPrettier
];
