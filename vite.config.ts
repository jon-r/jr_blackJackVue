import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) =>({
    plugins: [vue()],

    // todo maybe able to remove this with proper vue components
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.esm-bundler',
        },
    },

    server:
        mode !== "test"
        ? {
            port: 3000,
            strictPort: true,
          open: true,
        }
        : undefined,
}))
