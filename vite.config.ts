/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url';
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
      entry: fileURLToPath(new URL('./lib/main.ts', import.meta.url)),
      name: 'inactive-timer',
      fileName: 'inactive-timer',
    },
    sourcemap: true,
    rollupOptions: {
      external: ['vue', '@vueuse/core', 'worker-timers'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    environment: 'jsdom'
  },
});
