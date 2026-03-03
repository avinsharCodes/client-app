import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/tests/setup.ts'],
        coverage: {
            provider: 'v8',
            thresholds: {
                'src/shared/utils/**': { lines: 100, functions: 100, branches: 100, statements: 100 },
                'src/features/*/hooks/**': { lines: 90, functions: 90, branches: 90, statements: 90 },
                'src/tests/mocks/handlers.ts': { lines: 85, functions: 85, branches: 85, statements: 85 },
            },
        },
    },
});
