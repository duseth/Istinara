import {Account} from "../containers/Language";
import api from "../services/API"

class AuthService {
    emailValidation = new RegExp(".+@.+\\.[A-Za-z]+$");
    formDataHeaders = {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    };

    async Register(data, setError) {
        if (data.username.trim().length === 0 || data.email.trim().length === 0 || data.username.trim().length === 0) {
            setError("required", {message: <Account tid="error_required"/>});
            return;
        }

        if (!this.emailValidation.test(data.email)) {
            setError("email", {message: <Account tid="error_email"/>});
            return;
        }

        let formData = new FormData();
        formData.append("username", data.username)
        formData.append("email", data.email)
        formData.append("password", data.password)

        await api.post("/auth/register", formData, this.formDataHeaders).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error)
        })
    }

    async Login(data, setError) {
        if (data.password.trim().length === 0 || data.email.trim().length === 0) {
            setError("required", {message: <Account tid="error_required"/>});
            return;
        }

        if (!this.emailValidation.test(data.email)) {
            setError("email", {message: <Account tid="error_email"/>});
            return;
        }

        let formData = new FormData();
        formData.append("email", data.email)
        formData.append("password", data.password)

        let response = await api.post("/auth/login", formData, this.formDataHeaders);

        if (response !== undefined && response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", response.data.token);
        }
    }

    GetAuthHeader() {
        const token = localStorage.getItem("token");
        return {Authorization: "Bearer " + token} ? token : {};
    }

    Logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    GetCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();