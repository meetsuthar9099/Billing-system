import api from "@/api/dashboard";
const state = {
  settings: {},
  dashboardData:[]
  ///keys
};
const getters = {};

const mutations = {
  SET_DATA(state, data) {
    state.data = data;
  },
};

const actions = {
  async fetch({ commit }) {
    try {
      const result = await api.fetch();
      const data = result.data.data;
      commit("SET_DATA", data);
    } catch (err) {
      throw err;
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
