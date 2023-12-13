import api from "@/api/invoice";
import { StorageCache } from "@/exports/dataStorage";
const storageKey = "billing-all-customer-key";
export default {
  namespaced: true,
  state: {
    items: [],
    customer_invoices: [],
    item: {},
    invoiceNumber: {},
    allCustomers: [],
    totalPage: null,
    limit: null,
    projects: [],
    tasks: [],
  },
  mutations: {
    SET_ALLCUSTOMER(state, payload) {
      state.allCustomers = payload;
    },
    SET_PROJECT(state, payload) {
      state.projects = payload;
    },
    SET_TASKS(state, payload) {
      state.tasks = payload;
    },
    SET_TOTALPAGES(state, payload) {
      state.totalPage = payload;
    },
    SET_CURRENTPAGE(state, payload) {
      state.currentPage = payload;
    },
    SET_LIMIT(state, payload) {
      state.limit = payload;
    },
    SET_INVOICES(state, payload) {
      state.items = payload;
    },
    SET_CUSTOMER_INVOICES(state, payload) {
      state.customer_invoices = payload;
    },
    SET_INVOICE(state, payload) {
      state.item = payload;
    },
    SET_INVOICENUMBER(state, payload) {
      state.invoiceNumber = payload;
    },
  },
  actions: {
    async fetchAll({ commit }, payload) {
      const { query } = payload;
      const response = await api.invoices(query);
      let data = response.data;
      console.log("datadata",data)
      commit("SET_INVOICES", data.invoiceData);
      commit("SET_TOTALPAGES", data.totalPages);
      commit("SET_CURRENTPAGE", data.page);
      commit("SET_LIMIT", data.limit);
    },
    async fetchAllCustomerInvoice({ commit },payload) {
      const { customer_id } = payload;
      const response = await api.fetchAllCustomerInvoice(customer_id);
      let data = response.data.invoiceData;
      commit("SET_CUSTOMER_INVOICES", data);
    },
    async fetch({ commit }, payload) {
      try {
        const { id } = payload;
        const response = await api.invoice(id);
        let { invoiceData } = response.data;
        commit("SET_INVOICE", invoiceData);
      } catch (error) {
        throw error;
      }
    },
    async editInvoice({}, payload) {
      try {
        const { id, model } = payload;
        await api.editInvoice(id, model);
      } catch (error) {
        throw error;
      }
    },
    async deleteInvoice({}, payload) {
      try {
        const { id } = payload;
        await api.deleteInvoice(id);
      } catch (error) {
        throw error;
      }
    },
    async sentInvoice({}, payload) {
      try {
        const { id } = payload;
        await api.sentInvoice(id);
      } catch (error) {
        throw error;
      }
    },
    async getInvoiceNumber({ commit }, payload) {
      console.log("payLoad", payload);
      try {
        const { country_code } = payload;
        console.log("country_code", country_code);
        const response = await api.getInvoiceNumber(country_code);
        let data = response.data.invoice_number;
        commit("SET_INVOICENUMBER", data);
      } catch (error) {
        throw error;
      }
    },
    async fetchAllCustomers({ commit }) {
      try {
        const response = await api.allCustomers();
        let data = response.data.customerData;
        commit("SET_ALLCUSTOMER", data);
      } catch (error) {
        throw error;
      }
    },
    async fetchProjects({ commit }, { customer_id, invoice_id }) {
      const response = await api.customerProject({ customer_id, invoice_id });
      const data = response.data.Projects;
      commit("SET_PROJECT", data);
    },
    async fetchProjectTasks({ commit }) {
      const response = await api.customerProjectTasks({
        project_id,
        invoice_id,
      });
      const data = response.data.tasks;
      commit("SET_TASKS", data);
    },
    async addInvoice({}, payload) {
      try {
        await api.addInvoice(payload);
      } catch (error) {
        throw error;
      }
    },
    async invoiceGenerate({ commit }, id) {
      try {
        const response = await api.invoiceGenerate(id);
        console.log("SET_INVOICEPDF", response.data);
        // commit('SET_INVOICEPDF',response.data)
      } catch (error) {
        throw error;
      }
    },
  },
};
