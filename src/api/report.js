import axios from 'axios'

export default {
    async fetchData(model) {
        const { type, dateFrom, dateTo } = model
        return await axios.get(`report/${type}?date_from=${dateFrom}&date_to=${dateTo}`)
    }
}