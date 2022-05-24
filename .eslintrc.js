function getJestGlobals (flag = true) {
  return {
    afterAll: flag,
    afterEach: flag,
    beforeAll: flag,
    beforeEach: flag,
    describe: flag,
    expect: flag,
    fit: flag,
    it: flag,
    jest: flag,
    test: flag,
    xdescribe: flag,
    xit: flag,
    xtest: flag
  }
}

module.exports = {
  root: false,
  env: {
    es2021: true,
    node: true
  },
  extends: ['standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off'
  },
  globals: {
    ...getJestGlobals()
  }
}
