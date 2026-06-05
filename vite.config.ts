/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
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
        exports: 'named',
        globals: {
          vue: 'Vue',
          '@vueuse/core': 'VueuseCore',
          'worker-timers': 'WorkerTimers',
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
