import Cookies from 'universal-cookie';

import {
    GeneralForm,
    LoginText,
    ProfileEditForm,
    ProfilePasswordForm,
    ProfileText,
    RegisterText
} from "../containers/Language";
import api from "../../config/API"
import User from "../models/User";
import NotifyService from "./NotifyService";

class AccountService {
    cookies = new Cookies();
    validation = {
        email: new RegExp(".+@.+\\.[A-Za-z]+$"),
        username: new RegExp("^[а-яА-Яa-zA-Z0-9\\s]*$")
    };

    parseJwt = (token) => {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    async Register(data, setError) {
        if (data.username.trim().length === 0 || data.email.trim().length === 0 || data.password.trim().length === 0) {
            setError("register", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        if (!this.validation.username.test(data.username)) {
            setError("register", {message: <GeneralForm tid="error_username"/>});
            return;
        }

        if (!this.validation.email.test(data.email)) {
            setError("register", {message: <GeneralForm tid="error_email"/>});
            return;
        }

        if (data.password !== data.accept_password) {
            setError("register", {message: <GeneralForm tid="error_password"/>});
            return;
        }

        let formData = new FormData();
        formData.append("username", data.username.trim())
        formData.append("email", data.email.trim())
        formData.append("password", data.password.trim())

        return await api.post("/register", formData)
            .then((response) => {
                NotifyService.Success(<RegisterText tid="success_notify"/>);
                return response.data;
            })
            .catch(() => {
                NotifyService.Error(<RegisterText tid="error_notify"/>);
                return false;
            })
    }

    async Login(data, setError) {
        if (data.password.trim().length === 0 || data.email.trim().length === 0) {
            setError("login", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        if (!this.validation.email.test(data.email)) {
            setError("login", {message: <GeneralForm tid="error_email"/>});
            return;
        }

        let formData = new FormData();
        formData.append("email", data.email)
        formData.append("password", data.password)

        return await api.post("/login", formData)
            .then(response => {
                if (response.data) {
                    const token = this.parseJwt(response.data);

                    localStorage.setItem("user", JSON.stringify(token.user));
                    this.cookies.set("token", response.data, {path: "/", expires: new Date(token.exp * 1000)});

                    NotifyService.Success(<LoginText tid="success_notify"/>);
                    return true;
                }
            })
            .catch(() => {
                NotifyService.Error(<LoginText tid="error_notify"/>);
                return false;
            });
    }

    async Update(data, setError) {
        const user: User = this.GetCurrentUser();

        if (data.username === user.username && data.email === user.email) {
            return;
        }

        if (data.username.trim().length === 0 || data.email.trim().length === 0) {
            setError("edit_profile", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        if (!this.validation.username.test(data.username)) {
            setError("edit_profile", {message: <GeneralForm tid="error_username"/>});
            return;
        }

        if (!this.validation.email.test(data.email)) {
            setError("edit_profile", {message: <GeneralForm tid="error_email"/>});
            return;
        }

        let formData = new FormData();
        formData.append("username", data.username.trim())
        formData.append("email", data.email.trim())

        await api.post("/users/update", formData)
            .then((response) => {
                localStorage.setItem("user", JSON.stringify(response.data));
                NotifyService.Success(<ProfileEditForm tid="success_notify"/>);
            })
            .catch(() => {
                NotifyService.Error(<ProfileEditForm tid="error_notify"/>);
            })
    }

    async ChangePassword(data, setError) {
        if (
            data.current_password.trim().length === 0 ||
            data.new_password.trim().length === 0 ||
            data.accept_new_password.trim().length === 0
        ) {
            setError("change_password", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        if (data.new_password !== data.accept_new_password) {
            setError("change_password", {message: <GeneralForm tid="error_password"/>});
            return;
        }

        if (data.current_password === data.new_password) {
            setError("change_password", {message: <ProfilePasswordForm tid="error_same_password"/>});
            return;
        }

        let formData = new FormData();
        formData.append("password", data.current_password);
        formData.append("new_password", data.new_password);

        await api.post("/users/password", formData)
            .then(() => {
                NotifyService.Success(<ProfilePasswordForm tid="success_notify"/>);
            })
            .catch(() => {
                setError("change_password", {message: <ProfilePasswordForm tid="error_notify"/>});
            })
    }

    Logout() {
        this.cookies.remove("token");
        localStorage.removeItem("user");
        NotifyService.Success(<ProfileText tid="logout_notify"/>);
    }

    IsAuthorized() {
        return localStorage.getItem("user") && this.cookies.get("token") !== undefined;
    }

    IsTokenExpired() {
        return this.cookies.get("token_expired") !== undefined;
    }

    IsPrivilegedUser() {
        const token = this.cookies.get("token");
        if (!token) return false;

        return this.parseJwt(token).user.is_privileged;
    }

    GetCurrentUser = () => JSON.parse(localStorage.getItem("user"));
}

const service = new AccountService();
export default service;