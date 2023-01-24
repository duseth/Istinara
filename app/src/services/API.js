import axios from "axios";

const api = axios.create({
    baseURL: `${window.location.protocol}//${window.location.hostname}:8080/api`
})

export default api;