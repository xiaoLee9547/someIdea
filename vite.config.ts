import { URL, fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { getChangeLog } from './src/plugins/changeLog'

// https://vitejs.dev/config/
export default defineConfig(async () => {
    const changeLog = await getChangeLog(200)
    console.log(changeLog)
    return {
        plugins: [
            vue(),
            UnoCSS(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
    }
})
