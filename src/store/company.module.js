import api from "@/api/company";
const state = {
  settings: {},
  ///keys
};
const getters = {};

const mutations = {
  SET_SETTINGS(state, settings) {
    console.log("mutate settings data", settings);
    state.settings = settings;
  },
};

const actions = {
  async fetch({ commit }) {
    try {
      const result = await api.fetch();
      const data = result.data.settingData;
      commit("SET_SETTINGS", data);
    } catch (err) {
      throw err;
    }
  },
  async update({ }, model) {
    try {
      await api.update(model);
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
