module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // TypeScript에서는 I 접두사 없이 interface를 선호합니다.
    '@typescript-eslint/interface-name-prefix': 'off',

    // 명시적인 반환 유형을 항상 요구하지 않습니다. 이는 코드의 가독성을 향상시킬 수 있습니다.
    '@typescript-eslint/explicit-function-return-type': 'off',

    // 명시적인 모듈 경계 유형이 항상 필요하지 않을 수 있습니다.
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // any 사용을 허용하도록 설정합니다. 그러나 가능한 한 any 사용을 피하는 것이 좋습니다.
    '@typescript-eslint/no-explicit-any': 'off',

    // 미사용 변수에 대해 경고를 출력합니다. 개발 중에 유용합니다.
    '@typescript-eslint/no-unused-vars': 'warn',

    // 특정 파일에서 require()를 허용하도록 설정합니다.
    '@typescript-eslint/no-var-requires': 'off',

    // Prettier 규칙
    'prettier/prettier': 'error',
  },
};
