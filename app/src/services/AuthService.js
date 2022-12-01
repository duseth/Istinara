import axios from "axios";
import {Account} from "../containers/Language";

const API_URL = "http://localhost:5000/api/auth/";

class AuthService {
    emailValidation = new RegExp(".+@.+\\.[A-Za-z]+$");

    Register(data, setError) {
        if (data.username.trim().length === 0 || data.email.trim().length === 0 || data.username.trim().length === 0) {
            setError("required", {message: <Account tid="error_required"/>});
            return;
        }

        if (!this.emailValidation.test(data.email)) {
            setError("email", {message: <Account tid="error_email"/>});
            return;
        }

        return axios.post(API_URL + "register", {
            username: data.username, email: data.email, password: data.password
        }).then(response => {
            return response.data;
        });
    }

    Login(data, setError) {
        if (data.password.trim().length === 0 || data.email.trim().length === 0) {
            setError("required", {message: <Account tid="error_required"/>});
            return;
        }

        if (!this.emailValidation.test(data.email)) {
            setError("email", {message: <Account tid="error_email"/>});
            return;
        }

        return axios.post(API_URL + "login", {email: data.email, password: data.password})
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    localStorage.setItem("token", response.data.token);
                }

                return response.data;
            });
    }

    GetAuthHeader() {
        const token = localStorage.getItem('token');
        return {Authorization: 'Bearer ' + token} ? token : {};
    }

    Logout() {
        localStorage.removeItem("user");
    }

    GetCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();