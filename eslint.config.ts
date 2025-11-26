import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import typescriptLint from 'typescript-eslint';

export default defineConfig(
    eslint.configs.recommended,
    typescriptLint.configs.strict,
    {
        languageOptions: {
            globals: {
                ...globals.node
            }
        },
        rules: {
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-extraneous-class': 'off',
            '@typescript-eslint/no-unused-vars': 'off'
        }
    },
    [
        globalIgnores([
            'build/',
            'node_modules/'
        ])
    ]
);