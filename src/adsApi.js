import axios from 'axios'

class Api {
    getAds() {
        return axios.post('/get-ads', {})
    }
}

export default new Api()