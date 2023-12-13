import api from "@/api/customer";
import { StorageCache } from "@/exports/dataStorage";
// const storageKeyCustomer = 'billing-customer-type-key'
const storageKeyCustomerProject = 'billing-customer-project-type-key'
export default {
    namespaced: true,
    state: {
        customerUser: {},
        customerUsers: [],
        totalPage: null,
        limit: null,
        projects: [],
        currencies: []
    },
    mutations: {
        SET_CUSTOMER(state, payload) {
            state.customerUser = payload
        },
        SET_CURRENCIES(state, payload) {
            state.currencies = payload
        },
        SET_CUSTOMERS(state, payload) {
            state.customerUsers = payload
        },
        SET_TOTALPAGES(state, payload) {
            state.totalPage = payload
        },
        SET_CURRENTPAGE(state, payload) {
            state.currentPage = payload
        },
        SET_LIMIT(state, payload) {
            state.limit = payload
        },
        SET_PROJECTS(state, payload) {
            state.projects = payload
        },
    },
    actions: {
        async fetchAll({ commit }, payload) {
            // const storageCache = new StorageCache(storageKey)
            // console.log(payload, "payload");
            const query = payload.query
            try {
                // let { is_valid, value } = storageCache.getObject()
                // if (!is_valid || is_valid) {
                const response = await api.customers(query)
                let data = response.data
                //     storageCache.set(data)
                //     value = { ...data }
                // }
                commit('SET_CUSTOMERS', data.customerData)
                commit('SET_TOTALPAGES', data.totalPages)
                commit('SET_CURRENTPAGE', data.page)
                commit('SET_LIMIT', data.limit)
            } catch (error) {
                throw error
            }
        },
        async addCustomer({ dispatch }, payload) {
            // const storageCache = new StorageCache(storageKey)
            try {
                // storageCache.reset()
                await api.addCustomer(payload)
            } catch (error) {
                throw error
            }
        },
        async deleteCustomer({ }, id) {
            try {
                await api.deleteCustomer(id)
            } catch (error) {
                throw error
            }
        },
        async bulkDeleteCustomer({ }, arrayId) {
            try {
                await api.bulkDeleteCustomer(arrayId)
            } catch (error) {
                throw error
            }
        },
        async fetchCustomer({ commit }, id) {
            try {
                const response = await api.fetchCustomer(id)
                commit('SET_CUSTOMER', response.data.CustomerData)

            } catch (error) {
                throw error
            }
        },
        async editCustomer({ }, payload) {
            try {
                await api.editCustomer(payload.id, payload.model)
            } catch (error) {
                throw error
            }
        },
        async fetchCurrencies({ commit }) {
            // const storageCache = new StorageCache(storageKeyCustomerProject)
            try {
                // let { is_valid, value } = storageCache.getArray()
                // if (is_valid) {
                    const response = await api.fetchCurrencies()
                    console.log("response",response)
                    const data = response.data.data
                    commit('SET_CURRENCIES', data)
                    // storageCache.set(data)
                    // value.length = 0
                    // console.log({...data},"ValuePush")
                    // value.push({...data})
                // }
                // console.log('SET_PROJECTS', value)
            } catch (error) {
                throw error
            }
        },
        async fetchProjects({ commit }) {
            const storageCache = new StorageCache(storageKeyCustomerProject)
            try {
                let { is_valid, value } = storageCache.getArray()
                if (!is_valid) {
                    const response = await api.fetchProjects()
                    const data = response.data.projectData
                    storageCache.set(data)
                    value.length = 0
                    console.log({...data},"ValuePush")
                    value.push(...data)
                }
                console.log('SET_PROJECTS', value)
                commit('SET_PROJECTS', value)
            } catch (error) {
                throw error
            }
        },
    }
}
