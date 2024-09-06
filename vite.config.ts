import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
    "App": path.resolve(__dirname, "./src/App.tsx"),
    "env": path.resolve(__dirname, "./src/env.ts"),
    "apis": path.resolve(__dirname, "./src/apis"),
    "hooks": path.resolve(__dirname, "./src/hooks"),
    "layouts": path.resolve(__dirname, "./src/layouts"),
    "modules": path.resolve(__dirname, "./src/modules"),
    "routes": path.resolve(__dirname, "./src/routes"),
    "shared": path.resolve(__dirname, "./src/shared"),
    "stylesheets": path.resolve(__dirname, "./src/stylesheets"),
  },
},
base: '/providesk'
})
