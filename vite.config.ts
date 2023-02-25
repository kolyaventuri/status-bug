import tsconfigPaths from 'vite-tsconfig-paths';
/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [tsconfigPaths()],
});
