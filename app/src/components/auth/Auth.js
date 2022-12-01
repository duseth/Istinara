import React, {useContext, useEffect, useState} from "react"
import {useForm} from "react-hook-form";

import './Auth.scss'
import AuthService from "../../services/AuthService";
import {LanguageContext} from "../../languages/Language";
import {Account} from "../../containers/Language";

const Auth = () => {
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["profile"] + " • Istinara"
    }, [languageContext]);

    let [authMode, setAuthMode] = useState("sign-in")
    const changeAuthMode = () => {
        setAuthMode(authMode === "sign-in" ? "sign-up" : "sign-in")
    };

    const {register, setError, handleSubmit, formState: {errors}} = useForm();

    if (authMode === "sign-in") {
        return (
            <div className="Auth-form-container">
                <form onSubmit={handleSubmit((data) => AuthService.Login(data, setError))}
                      className="Auth-form" {...register("required")}>
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title"><Account tid="login_title"/></h3>
                        <div className="form-group mt-3">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="text"
                                name="email"
                                className="form-control mt-1"
                                {...register("email")}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="password"><Account tid="password_input"/></label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                {...register("password")}
                            />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="Auth-form-button">
                                <Account tid="login_button_text"/>
                            </button>
                        </div>
                    </div>
                    <div className="Auth-form-error">{errors?.required?.message || errors?.email?.message}</div>
                    <div className="text-center">
                        <p className="link-text">
                            <Account tid="not_registered_yet"/>{" "}
                            <a className="link" onClick={changeAuthMode} href="#">
                                <Account tid="register_redirect"/>
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="Auth-form-container">
            <form onSubmit={handleSubmit((data) => AuthService.Register(data, setError))}
                  className="Auth-form" {...register("required")}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title"><Account tid="register_title"/></h3>
                    <div className="form-group mt-3">
                        <label htmlFor="username"><Account tid="name_input"/></label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            name="username"
                            {...register("username")}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            name="email"
                            {...register("email")}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="password"><Account tid="password_input"/></label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            name="password"
                            {...register("password")}
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="Auth-form-button">
                            <Account tid="register_button_text"/>
                        </button>
                    </div>
                </div>
                <div className="Auth-form-error">{errors?.required?.message || errors?.email?.message}</div>
                <div className="text-center">
                    <p className="link-text">
                        <Account tid="already_registered"/>{" "}
                        <a className="link" onClick={changeAuthMode} href="#">
                            <Account tid="login_redirect"/>
                        </a>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default Auth