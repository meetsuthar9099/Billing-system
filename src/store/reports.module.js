import api from "@/api/report";
export default {
    namespaced: true,
    state: {
        data: [],
    },
    mutations: {
        SET_DATA(state, payload) {
            state.data = payload;
        },
    },
    actions: {
        async fetchData({ commit }, payload) {
            try {
                const { type, isExcel } = payload;
                const response = await api.fetchData(payload);
                if (isExcel) {
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(response.data);
                    link.download = `${type}${new Date().toISOString()}.xlsx`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    const { data } = response.data;
                    commit("SET_DATA", data);
                }
            } catch (error) {
                throw error;
            }
        },
    },
};
