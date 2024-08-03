import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) =>({
    plugins: [vue()],

    server:
        mode !== "test"
        ? {
            port: 3000,
            strictPort: true,
            open: true,
        }
        : undefined,
}))
