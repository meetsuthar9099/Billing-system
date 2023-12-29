import axios from 'axios';
const api = {
    async addExpenses(formdata) {
        return await axios.post('expenses', formdata, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    async fetchExpenses() {
        return await axios.get('expenses')
    },
    async fetchExpense(id) {
        return await axios.get(`expense/${id}`)
    },
    async deleteExpense(id) {
        return await axios.delete(`expense/${id}`)
    },
    async editExpense(id, formdata) {
        return await axios.put(`expense/${id}`, formdata, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    async allCustomers() {
        return await axios.get(`/customers`)
    },
    async fetchPaymentModes() {
        return await axios.get(`paymentmodes`)
    },
    async fetchCategory() {
        return await axios.get('expenseCategory')
    },
    async fetchReceipt(id) {
        return await axios.get(`expenseReceipt/${id}`, { responseType: 'blob' })
    }
}
export default api