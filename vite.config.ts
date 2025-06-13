import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ai-react-todolist-ts/', // 添加這行以支持在 GitHub Pages 子目錄下部署
});
