import toast from "react-hot-toast";

class NotifyService {
    style = {
        borderRadius: "10px",
        background: 'rgba(51,51,51,0.75)',
        color: "#FFF"
    };
    duration = 1500;

    Success(message: string) {
        toast.success(message, {
            style: this.style,
            duration: this.duration,
            iconTheme: {
                primary: "#000",
                secondary: "#00ff1f",
            },
        });
    }

    Error(message: string) {
        toast.error(message, {
            style: this.style,
            duration: this.duration,
            iconTheme: {
                primary: "#000",
                secondary: "#ff0000",
            },
        });
    }
}

export default new NotifyService();