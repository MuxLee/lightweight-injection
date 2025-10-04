import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@inject': path.resolve(__dirname, 'src/inject'),
            '@injection': path.resolve(__dirname, 'src/injection'),
            '@injector': path.resolve(__dirname, 'src/injector'),
            '@util': path.resolve(__dirname, 'src/util')
        }
    }
});