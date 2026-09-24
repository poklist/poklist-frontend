import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Component-rendering deps (@testing-library/react, @testing-library/jest-dom,
// @vitejs/plugin-react) are deliberately not installed — current and planned
// unit tests are all non-rendering (pure functions, zod schemas, zustand
// stores). Whoever first needs to render a component should add those three
// packages together with a `test.setupFiles` entry importing
// '@testing-library/jest-dom' — without setupFiles its matchers
// (toBeInTheDocument, etc.) will not be registered and will fail as
// "not a function".
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/locales/**'],
    },
  },
});
