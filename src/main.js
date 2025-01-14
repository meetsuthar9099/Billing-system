/* eslint-disable import/order */
// import '@/@iconify/icons-bundle'
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
const url = 'http://192.168.1.69:44000'
const baseURL = `${url}/api/billing`;
axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['x-api-key'] = 'vu1R)?xwy_o8Yy=X_^_L';
const imageUrl = `${url}/public/images/`
// Use plugins
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401 ||
            error.code == "ERR_NETWORK") {
            store.commit('UNAUTHENTICATE')
            router.push({ name: 'Login' })
        }
        return Promise.reject(error);
    }
);
store.dispatch('getToken')
store.dispatch('setLogo').then(() => {
    app.provide('logo', imageUrl + store.state.logo);
})
app.config.errorHandler = (err, vm, info) => {
    console.error('GLOBAL_ERROR_HANDLER:', err, vm, info);
};

app.use(vuetify)
// app.use(createPinia())
app.use(router)
app.use(store)
app.provide('store', store);
app.provide('imageUrl', imageUrl);
app.provide('baseUrl', baseURL);
// Mount vue app
app.mount('#app')
