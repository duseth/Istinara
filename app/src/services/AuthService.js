import {GeneralForm, Login, Profile, Register} from "../containers/Language";
import api from "../services/API"
import toast from "react-hot-toast";

class AuthService {
    emailValidation = new RegExp(".+@.+\\.[A-Za-z]+$");
    formDataHeaders = {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    };

    async Register(data, setError, changeAuthMode) {
        if (data.username.trim().length === 0 || data.email.trim().length === 0 || data.password.trim().length === 0) {
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        if (!this.emailValidation.test(data.email)) {
            setError("email", {message: <GeneralForm tid="error_email"/>});
            return;
        }

        let formData = new FormData();
        formData.append("username", data.username)
        formData.append("email", data.email)
        formData.append("password", data.password)

        await api.post("/auth/register", formData, this.formDataHeaders)
            .then(() => {
                toast.success(<Register tid="success_notify"/>);
                changeAuthMode();
            })
            .catch(() => {
                toast.error(<Register tid="error_notify"/>);
            })
    }

    async Login(data, setError) {
        if (data.password.trim().length === 0 || data.email.trim().length === 0) {
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        if (!this.emailValidation.test(data.email)) {
            setError("email", {message: <GeneralForm tid="error_email"/>});
            return;
        }

        let formData = new FormData();
        formData.append("email", data.email)
        formData.append("password", data.password)

        await api.post("/auth/login", formData, this.formDataHeaders)
            .then(response => {
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("token", response.data.token);
                toast.success(<Login tid="success_notify"/>);
            })
            .catch(() => {
                toast.error(<Login tid="error_notify"/>);
            });
    }

    GetAuthHeader() {
        const token = localStorage.getItem("token");
        return {Authorization: "Bearer " + token} ? token : {};
    }

    Logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        toast(<Profile tid="logout_notify"/>, {icon: "👋"});
    }

    GetCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();