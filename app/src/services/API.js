import axios from "axios";

const api = axios.create({
    baseURL: `${window.location.protocol}//istinara.ru/api`
})

export default api;