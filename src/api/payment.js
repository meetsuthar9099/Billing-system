import axios from 'axios'

export default {
    async payments({ page,customer_id,payment_mode,payment_number }) {
        return await axios.get(`/payments?page=${page ? page : 1}&limit=10&customer_id=${customer_id ? customer_id : ''}&payment_mode=${payment_mode ? payment_mode : ''}&payment_number=${payment_number ? payment_number : ''}`)
    },
    async fetchAllPayments() {
        return await axios.get(`/payments`)
    },
    async fetchPaymentModes() {
        return await axios.get(`paymentmodes`)
    },
    async payment(id){
        return axios.get(`/editPayment/${id}`)
    },
    async editPayment(id, model){
        return axios.post(`/editPayment/${id}`, model)
    },
    async addPayment(payload) {
        return axios.post('/addPayment', payload)
    },
    async getPaymentNumber() {
        return await axios.get(`getPaymentNumber`)
    },
    async update(model) {
        return await axios.post(`companySettings`, model)
    },
}
