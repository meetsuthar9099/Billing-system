import axios from 'axios'

export default {
    async fetch(query) {
        const date_from = query?.date_from
        const date_to = query?.date_to
        return await axios.get(`dashboardData?date_from=${date_from}&date_to=${date_to}`)
    },
    // async update(model) {
    //     return await axios.post(`companySettings`, model)
    // },
}
