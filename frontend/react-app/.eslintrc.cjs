module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-hooks', 'react-refresh', '@typescript-eslint', 'prettier'],
  settings: {
    react: {
      version: 'detect', // React 버전을 자동으로 감지합니다.
    },
  },
  rules: {
    // React 17 이후로 JSX Transform을 사용하면 React를 import하지 않아도 됩니다.
    'react/react-in-jsx-scope': 'off',

    // Hook의 규칙들
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // 다른 일반적인 React 규칙들
    'react/prop-types': 'off', // TypeScript를 사용하면 prop-types는 필요 없습니다.
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],

    // react-refresh 규칙
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // TypeScript 규칙
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',

    // Prettier 규칙
    'prettier/prettier': 'error',
  },
};
