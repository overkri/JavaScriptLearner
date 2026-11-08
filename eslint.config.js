const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  localStorage: 'readonly',
  sessionStorage: 'readonly',
  console: 'readonly',
  crypto: 'readonly',
  fetch: 'readonly',
  Response: 'readonly',
  Request: 'readonly',
  Headers: 'readonly',
  AbortController: 'readonly',
  AbortSignal: 'readonly',
  DOMException: 'readonly',
  structuredClone: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  queueMicrotask: 'readonly',
  URL: 'readonly',
  Intl: 'readonly',
  FormData: 'readonly',
  Event: 'readonly',
  CustomEvent: 'readonly',
  Node: 'readonly',
  HTMLElement: 'readonly',
  Element: 'readonly',
  requestAnimationFrame: 'readonly',
};

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '.verify-*/**',
      '.build-check/**',
      '.tscheck/**',
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: browserGlobals,
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'warn',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-unused-vars': [
        'error',
        { args: 'none', caughtErrors: 'none', ignoreRestSiblings: true },
      ],
      'no-async-promise-executor': 'error',
      'require-await': 'warn',
      'no-console': 'off',
      'no-debugger': 'error',
    },
  },
  {
    // Специальные упражнения про var/hoisting.
    files: [
      'src/playground/scopeQuiz.js',
      'src/playground/closureQuiz.js',
      'solutions/src/playground/scopeQuiz.js',
      'solutions/src/playground/closureQuiz.js',
    ],
    rules: {
      'no-var': 'off',
    },
  },
];
