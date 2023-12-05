import axios from 'axios';
const api = {
    invoices({ page, invoice_date_from, limit, invoice_date_to, due_date_from, due_date_to }) {
        return axios.get(`/invoices?page=${page ? page : 1}&limit=${limit ? limit : ''}&invoice_date_from=${invoice_date_from ? invoice_date_from : ''}&invoice_date_to=${invoice_date_to ? invoice_date_to : ''}&due_date_from=${due_date_from ? due_date_from : ''}&due_date_to=${due_date_to ? due_date_to : ''}`)
    },
    invoice(id){
        return axios.get(`/invoice/${id}`)
    },
    allCustomers() {
        return axios.get(`/customers`)
    },
    customerProject(id) {
        return axios.get(`/customerProject/${id}`)
    },
    addInvoice(model) {
        return axios.post(`/addInvoice`, model)
    },
    editInvoice(id, model){
        return axios.post(`/editInvoice/${id}`, model)
    }
}
export default api
