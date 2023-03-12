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

    Warning(message: string) {
        toast(message, {
            icon: "⚠️",
            style: this.style,
            duration: this.duration
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

    Confirm(message: string, yes: string, no: string, func: Function) {
        toast((t) => (
            (
                <div className="text-center p-2">
                    <h6>{message}</h6>
                    <button className="btn btn-outline-danger mx-1" onClick={() => {
                        toast.dismiss(t.id);
                        func();
                    }}>
                        {yes}
                    </button>
                    <button className="btn btn-outline-secondary mx-1" onClick={() => toast.dismiss(t.id)}>
                        {no}
                    </button>
                </div>
            )
        ), {duration: Infinity});
    }
}

export default new NotifyService();