import api from "@/api/expenses";
// import { StorageCache } from "@/exports/dataStorage";
// const storageKeyCustomer = 'billing-customer-type-key'
export default {
  namespaced: true,
  state: {
    items: [],
    item: [],
    customers: [],
    paymentModes: [],
    categories: [],
  },
  mutations: {
    SET_EXPENSES(state, payload) {
      state.items = payload
    },
    SET_EXPENSE(state, payload) {
      state.item = payload
    },
    SET_CUSTOMERS(state, payload) {
      state.customers = payload
    },
    SET_PAYMENT_MODES(state, payload) {
      state.paymentModes = payload
    },
    SET_CATEGORIES(state, payload) {
      state.categories = payload
    },
  },
  actions: {
    async addExpenses({ }, payload) {
      try {
        await api.addExpenses(payload)
      } catch (error) {
        throw error
      }
    },
    async editExpense({ }, payload) {
      try {
        const { id, formData } = payload
        await api.editExpense(id, formData)
      } catch (error) {
        throw error
      }
    },
    async deleteExpense({ }, id) {
      try {
        await api.deleteExpense(id)
      } catch (error) {
        throw error
      }
    },
    async fetchExpenses({ commit }) {
      try {
        const response = await api.fetchExpenses()
        const { expenses } = response.data
        commit('SET_EXPENSES', expenses)
      } catch (error) {
        throw error
      }
    },
    async fetchReceipt({ }, id) {
      try {
        const response = await api.fetchReceipt(id)
        const link = document.createElement("a");
        link.href = URL.createObjectURL(response.data);
        link.download = `${id}_${new Date().toISOString()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        throw error
      }
    },
    async fetchExpense({ commit }, id) {
      try {
        const response = await api.fetchExpense(id)
        console.log(response,"SET_EXPENSE");
        const { expense } = response.data
        commit('SET_EXPENSE', expense)
      } catch (error) {
        throw error
      }
    },
    async fetchCustomer({ commit }) {
      try {
        const response = await api.allCustomers()
        const { customerData } = response.data
        commit('SET_CUSTOMERS', customerData)
      } catch (error) {
        throw error
      }
    },
    async fetchPaymentModes({ commit }) {
      try {
        const response = await api.fetchPaymentModes()
        const { paymentModes } = response.data
        console.log('SET_PAYMENT_MODES', paymentModes)
        commit('SET_PAYMENT_MODES', paymentModes)
      } catch (error) {
        throw error
      }
    },
    async fetchCategory({ commit }) {
      try {
        const response = await api.fetchCategory()
        const { category } = response.data
        console.log("SET_CATEGORIES", category);
        commit('SET_CATEGORIES', category)
      } catch (error) {
        throw error
      }
    },
  },
};
