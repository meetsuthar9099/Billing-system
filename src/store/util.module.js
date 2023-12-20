import api from "@/api/util";
// import { StorageCache } from "@/exports/dataStorage";
// // const storageKeyCustomer = 'billing-customer-type-key'
// const storageKeyCustomerProject = 'billing-customer-project-type-key'
export default {
    namespaced: true,
    state: {
        currencies: [],
        paymentMode: []
    },
    mutations: {
        SET_CURRENCIES(state, payload) {
            state.currencies = payload
        },
        SET_PAYMENT_MODE(state, payload) {
            state.paymentMode = payload
        }
    },
    actions: {
        async fetchCurrencies({ commit }) {
            try {
                const response = await api.fetchCurrencies()
                console.log(response, "response");
                const data = response.data.data;
                commit("SET_CURRENCIES", data);
            } catch (error) {
                throw error
            }
        },
        async addCurrency({ }, payload) {
            try {
                await api.addCurrency(payload)
            } catch (error) {
                throw error
            }
        },
        async deleteCurrency({ }, id) {
            try {
                await api.deleteCurrency(id)
            } catch (error) {
                throw error
            }
        },
        async defaultCurrency({ }, id) {
            try {
                await api.defaultCurrency(id)
            } catch (error) {
                throw error
            }
        },
        async fetchAllPaymentMode({ commit }) {
            try {
                const response = await api.fetchAllPaymentMode()
                console.log(response, "response");
                const data = response.data.paymentModes;
                commit("SET_PAYMENT_MODE", data);
            } catch (error) {
                throw error
            }
        },
        async addPaymentMode({ },model) {
            try {
               await api.addPaymentMode(model)
            } catch (error) {
                throw error
            }
        },
        async deletePaymentMode({ },id) {
            try {
               await api.deletePaymentMode(id)
            } catch (error) {
                throw error
            }
        },
        async addCurrency({ }, payload) {
            try {
                await api.addCurrency(payload)
            } catch (error) {
                throw error
            }
        },
    },
}