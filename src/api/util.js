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
    },
    expenseCategory() {
        return axios.get(`/expenseCategory`)
    },
    addExpenseCategory(model) {
        return axios.post(`/expenseCategory`, model)
    },
    deleteExpenseCategory(id) {
        return axios.delete(`/expenseCategory/${id}`)
    },
    fetchCountries() {
        return axios.get(`/country`)
    },
    addCountry(payload) {
        return axios.post(`/country`, payload)
    },
    deleteCountry(id) {
        return axios.delete(`/country/${id}`)
    }
}
export default api