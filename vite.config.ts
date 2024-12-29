import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   define: {
//     'process.env': {}
//   }
// })

export default defineConfig({
  plugins: [react()],
  base: '/', 
  define: {
        'process.env': {}
      },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // Ensure no unnecessary chunks are created
      },
    },
  },
});
