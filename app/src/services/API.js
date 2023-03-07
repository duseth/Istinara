import axios from "axios";

const api = axios.create({
    baseURL: `${window.location.protocol}//${window.location.host}/api`
})

export default api;