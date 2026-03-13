import DefaultTheme from 'vitepress/theme'
import DocsDemo from '../components/DocsDemo.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DocsDemo', DocsDemo)
  },
}
