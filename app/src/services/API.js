import axios from "axios";

const API = axios.create({
    baseURL: `${window.location.protocol}//192.168.0.139:5000/api`
})

export default API;