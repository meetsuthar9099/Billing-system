import auth from "@/api/auth";
import axios from "axios";
import { createStore } from "vuex";
export default createStore({
    state: {
        user: {},
        token: {},
        role: {},
        isAuthenticate: false
    },
    mutations: {
        SET_USER(state, payload) {
            state.user = payload
        },
        AUTHENTICATE(
            state,
            { token, user, role }
        ) {
            state.token = token
            state.user = user
            state.role = role
            state.isAuthenticate = true
        },

        UNAUTHENTICATE(state) {
            state.token = {}
            state.user = {}
            state.role = {}
            state.isAuthenticate = false
        },
    },
    actions: {
        async login({ commit }, payload) {
            try {
                const { email, password } = payload
                const response = await auth.login(email, password)
                localStorage.setItem('accessToken', JSON.stringify(response.data))
                commit('AUTHENTICATE', response.data)
                console.log('AUTHENTICATE', response.data)

            } catch (error) {
                console.log(error, "Login_done?");
            }
        },
        getToken({ commit }) {
            try {
                const accessToken = localStorage.getItem('accessToken')
                if (!accessToken) throw new Error('No Token Found')
                const { token, user, role } = JSON.parse(accessToken)

                axios.defaults.user = user
                axios.defaults.role = role
                axios.defaults.headers.common['Authorization'] =
                    'Bearer ' + token

                commit('AUTHENTICATE', { token, user, role })
            } catch (err) {
                console.log('getToken', err)
            }
        },

    },
})
