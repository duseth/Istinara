import axios from "axios";
import Cookies from "universal-cookie";

const api = axios.create({
    baseURL: "https://istinara.ru/api"
})

api.interceptors.request.use(function (config) {
    config.headers["Content-Type"] = "multipart/form-data";

    const cookies = new Cookies();
    const token = cookies.get("token");

    if (token) {
        config.headers.Authorization = token;
    }

    return config;
});

export default api;