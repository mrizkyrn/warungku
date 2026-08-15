import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  noExternal: ['@warungku/shared-types', '@warungku/shared-schemas'],
});
