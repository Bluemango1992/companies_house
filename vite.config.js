import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/companies_house/',  // Add the repo name here
  plugins: [react()],
});
