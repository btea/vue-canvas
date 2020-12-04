import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import './css/index.css'
import installElementPlus from '@/plugins/element'

const app = createApp(App)
installElementPlus(app)
app.use(router)
app.mount('#app')
