import auth from "@/api/auth";
import axios from "axios";
import { createStore } from "vuex";
import customersModule from "./customers.module";
import invoiceModule from "./invoices.module";
import companyModule from "./company.module";
export default createStore({
    modules: {
        customers: customersModule,
        invoices: invoiceModule,
        company:companyModule
    },
    state: {
        user: {},
        token: {},
        role: {},
        isAuthenticate: false
    },
    mutations: {
        SET_USER(state, payload) {
            state.user = payload
        },
        AUTHENTICATE(
            state,
            { user_token, userdata, roleData }
        ) {
            state.token = user_token
            state.user = userdata
            state.role = roleData
            state.isAuthenticate = true
        },

        UNAUTHENTICATE(state) {
            localStorage.removeItem('accessToken')
            state.token = {}
            state.user = {}
            state.role = {}
            state.isAuthenticate = false
        },
    },
    actions: {
        async login({ commit }, payload) {
            try {
                const { email, password } = payload
                const response = await auth.login(email, password)
                axios.defaults.user = response.data.userdata
                axios.defaults.role = response.data.roleData
                axios.defaults.headers.common['x-access-token'] = response.data.user_token
                localStorage.setItem('accessToken', JSON.stringify(response.data))
                commit('AUTHENTICATE', response.data)
            } catch (error) {
                throw error
            }
        },
        getToken({ commit }) {
            try {
                const accessToken = localStorage.getItem('accessToken')
                if (!accessToken) throw new Error('No Token Found')
                const { user_token, userdata, roleData } = JSON.parse(accessToken)

                axios.defaults.user = userdata
                axios.defaults.role = roleData
                axios.defaults.headers.common['x-access-token'] = user_token

                commit('AUTHENTICATE', { user_token, userdata, roleData })
            } catch (err) {
                console.log('getToken', err)
            }
        },
        logout({ commit }) {
            commit('UNAUTHENTICATE')
            console.log('UNAUTHENTICATE')
        }

    },
})
