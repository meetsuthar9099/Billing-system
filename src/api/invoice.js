import axios from 'axios';
const api = {
    invoices({ page, invoice_date_from, limit, invoice_date_to, status, customer_id,invoice_number }) {
        return axios.get(`/invoices?page=${page ? page : 1}&limit=${limit ? limit : '10'}&invoice_date_from=${invoice_date_from ? invoice_date_from : ''}&invoice_date_to=${invoice_date_to ? invoice_date_to : ''}&customer_id=${customer_id ? customer_id :''}&status=${status ? status : ''}&invoice_number=${invoice_number ? invoice_number : ''} `)
    },
    fetchAllCustomerInvoice(customer_id){
        return axios.get(`/invoices/${customer_id}`)
    },
    invoice(id){
        return axios.get(`/invoice/${id}`)
    },
    allCustomers() {
        return axios.get(`/customers`)
    },
    customerProject({customer_id,invoice_id}) {
        return axios.get(`/customerProject/${customer_id}/${invoice_id}`)
    },
    customerProjectTasks(id) {
        return axios.get(`/customerProjectTasks/${id}`)
    },
    addInvoice(model) {
        return axios.post(`/invoices`, model)
    },
    editInvoice(id, model){
        return axios.put(`/invoice/${id}`, model)
    },
    deleteInvoice(id){
        return axios.delete(`/invoice/${id}`)
    },
    sentInvoice(id){
        return axios.get(`/sentInvoice/${id}`)
    },
    sendInvoice(model){
        return axios.post(`/sendInvoice`,model)
    },
    invoiceGenerate(id){
        return axios.get(`/invoiceGenerate/${id}`)
    },
    getInvoiceNumber(is_local) {
        return axios.get(`/getInvoiceNumber/?is_local=${is_local}`)
    },
}
export default api
