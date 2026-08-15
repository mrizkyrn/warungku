import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['src/**/*.test.ts', 'src/**/*.d.ts', 'src/server.ts', 'generated/**'],
    },
    env: {
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/warungku?schema=public',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
