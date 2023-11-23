import axios from 'axios';
const auth = {
    login(email, password) {
        return axios.post('/login', {
            email, password
        })
    }
}
export default auth
