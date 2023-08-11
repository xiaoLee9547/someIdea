// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
    presets: [
        presetAttributify({ /* preset options */}),
        presetUno(),
        presetRemToPx(),
    ],
    rules: [
        [/^vh-(\d+)$/, ([, d]) => ({ height: `${d}vh` })],
        [/^vw-(\d+)$/, ([, d]) => ({ width: `${d}vw` })],
    ],
})
