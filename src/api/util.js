import axios from 'axios';
const api = {
    fetchCurrencies() {
        return axios.get(`/currencies`)
    },
    addCurrency(model) {
        return axios.post(`/addCurrency`, model)
    },
    deleteCurrency(id) {
        return axios.delete(`/deleteCurrency/${id}`)
    },
    defaultCurrency(id) {
        return axios.put(`/defaultCurrency/${id}`)
    },
    fetchAllPaymentMode() {
        return axios.get(`/paymentmodes`)
    },
    deletePaymentMode(id) {
        return axios.delete(`/deletePaymentmode/${id}`)
    },
    addPaymentMode(model) {
        return axios.post(`/paymentmodes`, model)
    }
}
export default api