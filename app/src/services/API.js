import axios from "axios";

const API = axios.create({
    baseURL: `${window.location.protocol}//${window.location.host}/api`
})

export default API;