import DefaultTheme from 'vitepress/theme'

const components = import.meta.glob('../components/*.vue', { eager: true })

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    for (const path in components) {
      const name = path.match(/\/([^/]+)\.vue$/)[1]
      app.component(name, components[path].default)
    }
  },
}
