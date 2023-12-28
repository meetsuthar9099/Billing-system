import api from "@/api/report";
export default {
    namespaced: true,
    state: {
        data: []
    },
    mutations: {
        SET_DATA(state, payload) {
            state.data = payload
        }
    },
    actions: {
        async fetchData({ commit }, payload) {
            try {
                const response = await api.fetchData(payload)
                const { data } = response.data
                commit('SET_DATA', data)
            } catch (error) {
                throw error
            }
        }
    }
}