import api from "@/api/payment";
// import { StorageCache } from "@/exports/dataStorage";
// // const storageKeyCustomer = 'billing-customer-type-key'
// const storageKeyCustomerProject = 'billing-customer-project-type-key'
export default {
  namespaced: true,
  state: {
    item: {},
    items: [],
    payments: [],
    payment: {},
    paymentModes: [],
    // customerUser: {},
    // customerUsers: [],
    totalPage: null,
    limit: null,
    // projects: [],
    // currencies: []
  },
  mutations: {
    SET_PAYMENT_MODES(state, payload) {
      state.paymentModes = payload;
    },
    SET_PAYMENT_NUMBER(state, payload) {
      state.payment_number = payload;
    },
    // SET_CURRENCIES(state, payload) {
    //     state.currencies = payload
    // },
    SET_PAYMENTS(state, payload) {
        state.payments = payload
    },
    SET_PAYMENT(state, payload) {
        state.payment = payload
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
    // SET_PROJECTS(state, payload) {
    //     state.projects = payload
    // },
  },
  actions: {
    async fetchAll({ commit }, payload) {
        const query = payload.query
        try {
            const response = await api.payments(query)
            let data = response.data
            console.log("datadata",data)
            commit('SET_PAYMENTS', data.paymentData)
            commit('SET_TOTALPAGES', data.totalPages)
            commit('SET_CURRENTPAGE', data.page)
            commit('SET_LIMIT', data.limit)
        } catch (error) {
            throw error
        }
    },
    async fetchAllPayments({ commit }) {
      try {
          const response = await api.fetchAllPayments()
          let data = response.data
          console.log("datadata",data)
          commit('SET_PAYMENTS', data.paymentData)
      } catch (error) {
          throw error
      }
  },
    async fetch({ commit }, payload) {
        try {
          const { id } = payload;
          const response = await api.payment(id);
          let { paymentData } = response.data;
          commit("SET_PAYMENT", paymentData);
        } catch (error) {
          throw error;
        }
      },
      async setPaymentData({ commit }, payload) {
        try {
          console.log("payload",payload)
          commit("SET_PAYMENT", payload);
        } catch (error) {
          throw error;
        }
      },
   
    // async deleteCustomer({ }, id) {
    //     try {
    //         await api.deleteCustomer(id)
    //     } catch (error) {
    //         throw error
    //     }
    // },
    // async bulkDeleteCustomer({ }, arrayId) {
    //     try {
    //         await api.bulkDeleteCustomer(arrayId)
    //     } catch (error) {
    //         throw error
    //     }
    // },
    // async fetchCustomer({ commit }, id) {
    //     try {
    //         const response = await api.fetchCustomer(id)
    //         commit('SET_CUSTOMER', response.data.CustomerData)

    //     } catch (error) {
    //         throw error
    //     }
    // },
    // async editCustomer({ }, payload) {
    //     try {
    //         await api.editCustomer(payload.id, payload.model)
    //     } catch (error) {
    //         throw error
    //     }
    // },
    async addPayment({ }, payload) {
      try {
        await api.addPayment(payload);
      } catch (error) {
        throw error;
      }
    },
    async editPayment({}, payload) {
        try {
          const { id, model } = payload;
          await api.editPayment(id, model);
        } catch (error) {
          throw error;
        }
      },
    async fetchPaymentModes({ commit }) {
      try {
        const response = await api.fetchPaymentModes();
        const data = response.data.paymentModes;
        commit("SET_PAYMENT_MODES", data);
      } catch (error) {
        throw error;
      }
    },
    async getPaymentNumber({ commit }) {
      try {
        const response = await api.getPaymentNumber();
        console.log("responseresponse", response);
        const data = response.data.payment_number;
        commit("SET_PAYMENT_NUMBER", data);
      } catch (error) {
        throw error;
      }
    },
    async fetchProjects({ commit }) {
      const storageCache = new StorageCache(storageKeyCustomerProject);
      try {
        let { is_valid, value } = storageCache.getArray();
        if (!is_valid) {
          const response = await api.fetchProjects();
          const data = response.data.projectData;
          storageCache.set(data);
          value.length = 0;
          console.log({ ...data }, "ValuePush");
          value.push(...data);
        }
        console.log("SET_PROJECTS", value);
        commit("SET_PROJECTS", value);
      } catch (error) {
        throw error;
      }
    },
  },
};
