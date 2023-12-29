import axios from 'axios'

export default {
    async fetch() {
        return await axios.get(`dashboardData`)
    },
    // async update(model) {
    //     return await axios.post(`companySettings`, model)
    // },
}
