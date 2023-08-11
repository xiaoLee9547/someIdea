/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    extends: '@antfu',
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        '@typescript-eslint/indent': ['error', 4],
        'antfu/top-level-function': 'off',
        'no-void': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        'vue/html-indent': ['error', 4],
        'no-console': 'off',
        'curly': 'off',
        'antfu/if-newline': 'off',
        'vue/v-on-event-hyphenation': 'off',
        '@typescript-eslint/brace-style': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/consistent-type-assertions': 'off',
        'no-prototype-builtins': 'off',
    },
}
