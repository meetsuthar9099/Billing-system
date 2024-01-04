import api from "@/api/auditlog";
// import { errorHandler } from '../exports/error_management'

const state = {
  items: [],
  users: [],
  totalPage: null,
  limit: null,
  pagination: null,
  logTypes: [],
  currentPage:null
};

const mutations = {
  set(state, payload) {
    state.items = payload;
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
  set_logType(state, payload) {
    state.logTypes = payload;
  },
  set_users(state, payload) {
    state.users = payload;
  },
  delete(state, id) {
    let index = state.items.findIndex((x) => x.id == id);
    state.items.splice(index, 1);
  },
  set_pagination(state, pag) {
    state.pagination = pag;
  },
};

const actions = {
  async fetch({ commit }, payload) {
    const query = payload?.query ? payload?.query : "";
    const response = await api.fetch(query);
    let data = response.data;
    console.log("datadata", data);
    commit("set", data.logs);
    commit("SET_TOTALPAGES", data.totalPages);
    commit("SET_CURRENTPAGE", data.currentPage);
    commit("SET_LIMIT", data.limit);
  },
  async users({ commit }) {
    const response = await api.users();
    let data = response.data;
    commit("set_users", data.users);
  },
  async logTypes({ commit }) {
    const response = await api.logTypes();
    let data = response.data;
    console.log("ress", response);
    commit("set_logType", data.types);
  },
  // types(context) {
  //     return api
  //         .types()
  //         .then(({
  //             data: {
  //                 success: { data: typeData },
  //             },
  //         }) => context.commit("set_type", typeData))
  //         .catch(err => {
  //             errorHandler(err)
  //         })
  // },
  // delete(context, id) {
  //     return api
  //         .delete(id)
  //         .then(() => context.commit('delete', id))
  //         .catch(err => {
  //             errorHandler(err)
  //         })
  // },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
