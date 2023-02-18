import {
    GeneralForm,
    LoginText,
    ProfileEditForm,
    ProfilePasswordForm,
    ProfileText,
    RegisterText
} from "../containers/Language";
import api from "../services/API"
import toast from "react-hot-toast";
import User from "../models/User";
import Cookies from 'universal-cookie';

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
                toast.success(<RegisterText tid="success_notify"/>);
                changeAuthMode();
            })
            .catch(() => {
                toast.error(<RegisterText tid="error_notify"/>);
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

                toast.success(<LoginText tid="success_notify"/>);
            })
            .catch(() => {
                toast.error(<LoginText tid="error_notify"/>);
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
                toast.success(<ProfileEditForm tid="success_notify"/>);
            })
            .catch(() => {
                toast.error(<ProfileEditForm tid="error_notify"/>);
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
                toast.success(<ProfilePasswordForm tid="success_notify"/>);
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
        toast(<ProfileText tid="logout_notify"/>, {icon: "👋"});
    }

    GetCurrentUser = () => JSON.parse(localStorage.getItem("user"));
}

let service = new AccountService();
export default service;