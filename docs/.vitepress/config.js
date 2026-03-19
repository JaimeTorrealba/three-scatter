import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // site-level options
  title: 'Three Scatter Docs',
  description: 'Documentation official for three-scatter',

    head: [
    ['script', { 'defer': 'true', 'data-site': 'OWBUVCJK', 'src': 'https://cdn.usefathom.com/script.js' }],
  ],
   themeConfig: {
    logo: '/logo.svg',
    search: {
      provider: 'local',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/guide/api/' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [{ text: 'Introduction', link: '/guide/' }],
      },
      {
        text: 'Examples',
        items: [
          { text: 'Multiple objects', link: '/guide/examples/multi-model' },
          { text: 'Transformations', link: '/guide/examples/transformations' },
          { text: 'Take over', link: '/guide/examples/take-over' },
          { text: 'Seeds', link: '/guide/examples/seeds' },
          { text: 'Align objects', link: '/guide/examples/align-models' },
          { text: 'Remove collisions', link: '/guide/examples/remove-collisions' },
          { text: 'Display by axis', link: '/guide/examples/display-by-axis' },
          { text: 'Dispose', link: '/guide/examples/dispose' },
          { text: 'Debug mode', link: '/guide/examples/debug-mode' },
          { text: 'Distribution', link: '/guide/examples/distribution' },
          { text: 'Model animation', link: '/guide/examples/model-animation' },
          { text: 'Clusters', link: '/guide/examples/clusters' },
          { text: 'React three fiber', link: '/guide/examples/react-three-fiber' },
          { text: 'Tres.js', link: '/guide/examples/tres-js' },
        ].sort((a, b) => a.text.localeCompare(b.text)),
      },
      {
        text: 'API',
        items: [
          { text: 'API specification', link: '/guide/api/' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'twitter', link: 'https://x.com/jaimebboyjt' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/jaimebboyjt.bsky.social' },
      { icon: 'github', link: 'https://github.com/JaimeTorrealba/three-scatter' },
    ],
  },
  vite: {
    ssr: {
      noExternal: ['three'],
    },
    optimizeDeps: {
      exclude: ['vitepress'],
      include: ['three'],
    },
    server: {
      hmr: {
        overlay: false,
      },
    },
    resolve: {
      dedupe: ['three'],
      alias: {
        'three-scatter': resolve(__dirname, '../../src/index.ts'),
      },
    },
  },
})