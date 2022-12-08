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
            <section className="auth-container">
                <div className="container py-5">
                    <div className="row d-flex justify-content-center align-items-center m-1">
                        <form onSubmit={handleSubmit((data) => AuthService.Login(data, setError))}
                              className="auth-form" {...register("required")}>
                            <div className="auth-form-content">
                                <h3 className="auth-form-title"><Account tid="login_title"/></h3>
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
                                    <button type="submit" className="auth-form-button">
                                        <Account tid="login_button_text"/>
                                    </button>
                                </div>
                            </div>
                            <div
                                className="auth-form-error">{errors?.required?.message || errors?.email?.message}</div>
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
                </div>
            </section>
        )
    }

    return (
        <section className="auth-container">
            <div className="container py-5">
                <div className="row d-flex justify-content-center align-items-center m-1">
                    <form onSubmit={handleSubmit((data) => AuthService.Register(data, setError))}
                          className="auth-form" {...register("required")}>
                        <div className="auth-form-content">
                            <h3 className="auth-form-title"><Account tid="register_title"/></h3>
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
                                <button type="submit" className="auth-form-button">
                                    <Account tid="register_button_text"/>
                                </button>
                            </div>
                        </div>
                        <div className="auth-form-error">{errors?.required?.message || errors?.email?.message}</div>
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
            </div>
        </section>
    )
}

export default Auth