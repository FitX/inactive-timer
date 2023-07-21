/// <reference types="vitest" />
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [
    eslint({
      include: [
        './lib/**/*.ts',
      ],
    }),
  ],
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'inactive-timer',
      fileName: 'inactive-timer',
    },
    sourcemap: true,
  },
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    environment: 'jsdom'
  },
});
