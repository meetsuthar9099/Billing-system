import axios from 'axios';
const auth = {
    login(email, password) {
        return axios.post('/login', {
            company_email: email, password
        })
    },
    getLogo() {
        return axios.post('/getSettingData', {
            key: 'logo'
        })
    },
}
export default auth
