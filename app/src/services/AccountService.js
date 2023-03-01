import {
    GeneralForm,
    LoginText,
    ProfileEditForm,
    ProfilePasswordForm,
    ProfileText,
    RegisterText
} from "../containers/Language";
import api from "../services/API"
import User from "../models/User";
import Cookies from 'universal-cookie';
import NotifyService from "./NotifyService";

class AccountService {
    cookies = new Cookies();
    validation = {
        email: new RegExp(".+@.+\\.[A-Za-z]+$"),
        username: new RegExp("^[а-яА-Яa-zA-Z0-9\\s]*$")
    }

    async Register(data, setError, changeAuthMode) {
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

        await api.post("/auth/register", formData, this.GetHeaders(true, false))
            .then(() => {
                NotifyService.Success(<RegisterText tid="success_notify"/>);
                changeAuthMode();
            })
            .catch(() => {
                NotifyService.Error(<RegisterText tid="error_notify"/>);
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

        await api.post("/auth/login", formData, this.GetHeaders(true, false))
            .then(response => {
                localStorage.setItem("user", JSON.stringify(response.data.user));

                const token = JSON.parse(atob(response.data.token.split(".")[1]));
                this.cookies.set("token", response.data.token, {path: "/", expires: new Date(token.exp * 1000)});

                NotifyService.Success(<LoginText tid="success_notify"/>);
            })
            .catch(() => {
                NotifyService.Error(<LoginText tid="error_notify"/>);
            });
    }

    async Edit(data, setError) {
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

        await api.post("/user/edit", formData, this.GetHeaders(true, true))
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
        formData.append("current_password", data.current_password);
        formData.append("new_password", data.new_password);
        formData.append("accept_new_password", data.accept_new_password);

        await api.post("/user/change_password", formData, this.GetHeaders(true, true))
            .then(() => {
                NotifyService.Success(<ProfilePasswordForm tid="success_notify"/>);
            })
            .catch(() => {
                setError("change_password", {message: <ProfilePasswordForm tid="error_notify"/>});
            })
    }

    GetHeaders(post?: boolean, auth?: boolean) {
        let config = {
            headers: {}
        };

        if (post) {
            config["headers"]["Content-Type"] = "multipart/form-data"
        }

        if (auth) {
            const token = this.cookies.get("token");
            if (token !== undefined) {
                config["headers"]["Authorization"] = "Bearer " + token;
            }
        }

        return config
    }

    Logout() {
        localStorage.removeItem("user");
        this.cookies.remove("token");
        NotifyService.Success(<ProfileText tid="logout_notify"/>);
    }

    GetCurrentUser = () => JSON.parse(localStorage.getItem("user"));
}

let service = new AccountService();
export default service;