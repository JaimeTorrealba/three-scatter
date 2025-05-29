import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    resolve: {
        alias: {
          'three-scatter': resolve(__dirname, '../src/index.ts'),
        },
      },
})