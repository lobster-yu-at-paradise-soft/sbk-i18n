import { createApp } from 'vue'
import VueClipboard from 'vue3-clipboard'
import App from './App.vue'

const app = createApp(App)
app
  .use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
  })
  .mount('#app')
