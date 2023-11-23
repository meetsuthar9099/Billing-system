/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'
import axios from 'axios'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import store from './store'
loadFonts()


// Create vue app
const app = createApp(App)
axios.defaults.baseURL = "http://192.168.1.45:8000/api/";
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// Use plugins
store.dispatch('getToken')
console.log(store.state.token, "store.state.user");
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(store)
app.provide('store', store);
// Mount vue app
app.mount('#app')
