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
// import { createPinia } from 'pinia'
import { createApp } from 'vue'
import store from './store'
loadFonts()


// Create vue app
const app = createApp(App)
const url = 'http://192.168.1.11:44000'
axios.defaults.baseURL = `${url}/api/billing`;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['x-api-key'] = 'vu1R)?xwy_o8Yy=X_^_L';
const imageUrl = `${url}/public/images/`
// Use plugins
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            store.commit('UNAUTHENTICATE')
            router.push({ name: 'Login' })
        }
        return Promise.reject(error);
    }
);
store.dispatch('getToken')
store.dispatch('setLogo').then(()=>{
    app.provide('logo', imageUrl + store.state.logo);
})


app.use(vuetify)
// app.use(createPinia())
app.use(router)
app.use(store)
app.provide('store', store);
app.provide('imageUrl', imageUrl);
// Mount vue app
app.mount('#app')
