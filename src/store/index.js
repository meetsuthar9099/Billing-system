import auth from "@/api/auth";
import axios from "axios";
import { createStore } from "vuex";
import customersModule from "./customers.module";
import invoiceModule from "./invoices.module";
import { StorageCache } from "@/exports/dataStorage";
const logoKey = 'logo-key'
import companyModule from "./company.module";
import paymentModule from "./payment.module"
import utilModule from "./util.module";
import auditLogModule from "./auditlogs.module"
import dashboardModule from "./dashboard.module";
import expensesModule from "./expenses.module";
import reportsModule from "./reports.module";
export default createStore({
    modules: {
        customers: customersModule,
        invoices: invoiceModule,
        company: companyModule,
        payment: paymentModule,
        dashboard: dashboardModule,
        util: utilModule,
        auditLog: auditLogModule,
        expenses: expensesModule,
        reports: reportsModule
    },
    state: {
        user: {},
        token: {},
        role: {},
        permissions: [],
        logo: null,
        isAuthenticate: false
    },
    mutations: {
        SET_USER(state, payload) {
            state.user = payload
        },
        // SET_PERMISSIONS(state, payload) {
        //     state.permissions = payload
        // },
        SET_LOGO(state, payload) {
            state.logo = payload
        },
        AUTHENTICATE(
            state,
            { user_token, userdata, permissions, roleData }
        ) {
            state.token = user_token
            state.user = userdata
            state.role = roleData
            state.permissions = permissions
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
                console.log("response", response)
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
                const { user_token, userdata, roleData, permissions } = JSON.parse(accessToken)

                axios.defaults.user = userdata
                axios.defaults.role = roleData
                axios.defaults.headers.common['x-access-token'] = user_token

                commit('AUTHENTICATE', { user_token, userdata, roleData, permissions })
            } catch (err) {
                console.log('getToken', err)
            }
        },
        async setLogo({ commit }) {
            const storageCache = new StorageCache(logoKey)
            try {
                let { is_valid, value } = storageCache.getArray()
                if (!is_valid) {
                    const response = await auth.getLogo()
                    const data = response.data
                    if (data) {
                        storageCache.set(data)
                        value.length = 0
                        value.push(...data)
                    }
                }
                commit('SET_LOGO', value[0])
            } catch (error) {
                throw error
            }
        },
        logout({ commit }) {
            commit('UNAUTHENTICATE')
            console.log('UNAUTHENTICATE')
        }

    },
})
