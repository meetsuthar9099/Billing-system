import axios from 'axios';
const api = {
    customers({ page, name, contact_name, phone }) {
        return axios.get(`/customers?page=${page ? page : 1}&limit=10&name=${name ? name : ''}&contact_name=${contact_name ? contact_name : ''}&phone=${phone ? phone : ''}`)
    },
    addCustomer(payload) {
        return axios.post('/customers', payload)
    },
    deleteCustomer(id) {
        return axios.delete(`/customers/${id}`)
    },
    bulkDeleteCustomer(customer_id) {
        return axios.post(`/deleteCustomers`, { customer_id })
    },
    fetchCustomer(id) {
        return axios.get(`/customers/${id}`)
    },
    editCustomer(id, payload) {
        return axios.put(`/customers/${id}`, payload)
    },
    fetchProjects(id) {
        return axios.get(`/projects/${id}`)
    },
    fetchCurrencies() {
        return axios.get(`/currencies`)
    }
}
export default api
