import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { setupQuery } from './plugins/query'

const app = createApp(App)

app.use(createPinia())
app.use(router)
setupQuery(app)

app.mount('#app')
