import { lingui } from '@lingui/vite-plugin';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {},
  },
  plugins: [
    react({ babel: { plugins: ['macros'] } }),
    lingui(),
    {
      name: 'copy-redirect-file',
      closeBundle() {
        const redirectPath = '_redirects';
        const redirectContent = '/* /index.html 200\n';

        // 如果文件不存在，先創建它
        if (!existsSync(redirectPath)) {
          writeFileSync(redirectPath, redirectContent);
        }

        // 複製到 dist 目錄
        copyFileSync(redirectPath, 'dist/_redirects');
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
