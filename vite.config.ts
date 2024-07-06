import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/VGOR_IMAGE_JOBBER_VIEW/', // Ensure this matches your repository name
  plugins: [react()],
});
