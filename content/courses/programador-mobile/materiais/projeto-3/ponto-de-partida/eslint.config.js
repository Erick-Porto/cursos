import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  js.configs.recommended,
  {
    // o app roda no navegador: document, localStorage e fetch já existem lá
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // este arquivo de configuração roda no Node
    files: ['eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
  {
    // os testes rodam no Jest, dentro do Node
    files: ['**/*.test.js'],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
  },
]);
