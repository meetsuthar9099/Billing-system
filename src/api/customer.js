import axios from 'axios';
const api = {
    customers({ page, name, contact_name, phone }) {
        return axios.get(`/customers?page=${page ? page : 1}&limit=10&name=${name ? name : ''}&contact_name=${contact_name ? contact_name : ''}&phone=${phone ? phone : ''}`)
    },
    addCustomer(payload) {
        return axios.post('/addCustomer', payload)
    },
    deleteCustomer(id) {
        return axios.delete(`/deleteCustomers/${id}`)
    },
    bulkDeleteCustomer(customer_id) {
        return axios.post(`/deleteCustomers`, { customer_id })
    },
    fetchCustomer(id) {
        return axios.get(`/viewCustomer/${id}`)
    },
    editCustomer(id, payload) {
        return axios.post(`/editCustomers/${id}`, payload)
    },
    fetchProjects() {
        return axios.get(`/projects`)
    }
}
export default api
