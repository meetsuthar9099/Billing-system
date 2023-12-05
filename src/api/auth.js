import axios from 'axios';
const auth = {
    login(email, password) {
        return axios.post('/login', {
            company_email: email, password
        })
    }
}
export default auth
