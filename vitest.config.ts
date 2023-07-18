/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    include: ['./test/**/*.e2e-spec.ts'],
    coverage: {
      provider: 'istanbul', // or 'v8'
      reporter: ['text', 'html', 'lcov'],
    },
  },
});
