import axios from 'axios'

export default {
    async fetchData(model) {
        const { type, dateFrom, dateTo, isExcel } = model
        return await axios.get(`report/${type}?date_from=${dateFrom}&date_to=${dateTo}&isExcel=${isExcel ? 1 : 0}`, {
            responseType: isExcel ? 'blob' : 'json'
        })
    }
}