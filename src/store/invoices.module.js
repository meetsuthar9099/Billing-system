import api from "@/api/invoice";
import { StorageCache } from "@/exports/dataStorage";
const storageKey = 'billing-all-customer-key'
export default {
    namespaced: true,
    state: {
        items: [],
        item: {},
        allCustomers: [],
        totalPage: null,
        limit: null,
        projects: []
    },
    mutations: {
        SET_ALLCUSTOMER(state, payload) {
            state.allCustomers = payload
        },
        SET_PROJECT(state, payload) {
            state.projects = payload
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
        SET_INVOICES(state, payload) {
            state.items = payload
        },
        SET_INVOICE(state, payload) {
            state.item = payload
        },
    },
    actions: {
        async fetchAll({ commit }, payload) {
            const { query } = payload
            const response = await api.invoices(query)
            let data = response.data
            commit('SET_INVOICES', data.invoiceData)
            commit('SET_TOTALPAGES', data.totalPages)
            commit('SET_CURRENTPAGE', data.page)
            commit('SET_LIMIT', data.limit)
        },
        async fetch({ commit }, payload) {
            try {
                const { id } = payload
                const response = await api.invoice(id)
                let { invoiceData } = response.data
                commit('SET_INVOICE', invoiceData)
            } catch (error) {
                throw error
            }
        },
        async editInvoice({ }, payload) {
            try {
                const { id, model } = payload
                await api.editInvoice(id, model)
            } catch (error) {
                throw error
            }
        },
        async deleteInvoice({ }, payload) {
            try {
                const { id } = payload
                await api.deleteInvoice(id)
            } catch (error) {
                throw error
            }
        },
        async getInvoiceNumber({ }, payload) {
            console.log("payLoad",payload)
            try {
                const { country_code } = payload
                console.log("country_code",country_code)
                await api.getInvoiceNumber(country_code)
            } catch (error) {
                throw error
            }
        },
        async fetchAllCustomers({ commit }) {
            const storageCache = new StorageCache(storageKey)
            try {
                const { is_valid, value } = storageCache.getArray()
                if (!is_valid) {
                    const response = await api.allCustomers()
                    let data = response.data.customerData
                    storageCache.set(data)
                    value.length = 0
                    value.push(...data)
                }
                commit('SET_ALLCUSTOMER', value)
            } catch (error) {
                throw error
            }
        },
        async fetchProjects({ commit }, customer_id) {
            console.log("SET_PROJECT", customer_id);
            const response = await api.customerProject(customer_id)
            const data = response.data.Projects
            commit('SET_PROJECT', data)
        },
        async addInvoice({ }, payload) {
            try {
                await api.addInvoice(payload)
            } catch (error) {
                throw error
            }
        },
        async invoiceGenerate({commit},id){
            try {
                const response = await api.invoiceGenerate(id)
                console.log('SET_INVOICEPDF',response.data)
                // commit('SET_INVOICEPDF',response.data)
            } catch (error) {
                throw error
            }
        }
    }
}
