import React, {useContext, useEffect, useState} from "react"
import {useForm} from "react-hook-form";

import './Auth.scss'
import AuthService from "../../services/AuthService";
import User from "../../models/User";
import {LanguageContext} from "../../languages/Language";
import {Account, Login, Profile, Register} from "../../containers/Language";

const Auth = () => {
    const languageContext = useContext(LanguageContext);

    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["profile"] + " • Istinara";
    }, [languageContext]);

    let [authMode, setAuthMode] = useState("sign-in")
    const changeAuthMode = () => {
        setAuthMode(authMode === "sign-in" ? "sign-up" : "sign-in")
    };

    const getRegistrationDate = (user: User) => {
        let date = new Date(user.created_at);
        const locale = localStorage.getItem("lang") === "ru" ? "ru-RU" : "ar-AE";
        const options = {day: "numeric", month: "long", year: 'numeric'};

        return date.toLocaleDateString(locale, options)
    }

    const logout = () => {
        AuthService.Logout();
        setRerender(!rerender);
    };

    const {register, setError, handleSubmit, formState: {errors}} = useForm();

    let user = AuthService.GetCurrentUser();
    if (user != null) {
        return (
            <section className="auth-container">
                <div className="container py-5">
                    <div className="row d-flex justify-content-center align-items-center m-1 profile-header">
                        <div className="col-1">
                            <i className="bi bi-person-circle profile-bi-icon"/>
                        </div>
                        <div className="col-5">
                            <div className="profile-name">{user.username}</div>
                            <div className="profile-registration">
                                <Profile tid="registration_date"/>: {getRegistrationDate(user)}
                            </div>
                        </div>
                        <div className="col-2">
                            <button type="button" className="btn btn-outline-dark logout-button"
                                    onClick={logout}>
                                <i className="bi bi-box-arrow-right logout-bi-icon"/> <Profile tid="logout"/>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (authMode === "sign-in") {
        return (
            <section className="auth-container">
                <div className="container py-5">
                    <div className="row d-flex justify-content-center align-items-center m-1">
                        <form onSubmit={handleSubmit((data) => AuthService.Login(data, setError))}
                              className="auth-form" {...register("required")}>
                            <div className="auth-form-content">
                                <h3 className="auth-form-title"><Login tid="title"/></h3>
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
                                        <Login tid="button_text"/>
                                    </button>
                                </div>
                            </div>
                            <div
                                className="auth-form-error">{errors?.required?.message || errors?.email?.message}</div>
                            <div className="text-center">
                                <p className="link-text">
                                    <Login tid="not_registered_yet"/>{" "}
                                    <a className="link" onClick={changeAuthMode} href="#">
                                        <Login tid="register_redirect"/>
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
                            <h3 className="auth-form-title"><Register tid="title"/></h3>
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
                                    <Register tid="button_text"/>
                                </button>
                            </div>
                        </div>
                        <div className="auth-form-error">{errors?.required?.message || errors?.email?.message}</div>
                        <div className="text-center">
                            <p className="link-text">
                                <Register tid="already_registered"/>{" "}
                                <a className="link" onClick={changeAuthMode} href="#">
                                    <Register tid="login_redirect"/>
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