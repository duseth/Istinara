import React, {useContext, useState} from "react";
import {useForm} from "react-hook-form";

import AccountService from "../../services/AccountService";
import {LanguageContext} from "../../../bin/context/Language";
import {AccountText, LoginText, ProfileText} from "../../containers/Language";

const LoginForm = ({toRegister}) => {
    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const [loginPasswordShown, setLoginPasswordShown] = useState(false);
    const {register, setError, handleSubmit, formState: {errors}} = useForm();

    const getShowPwdIcon = () => {
        return lang === "ar" ? "show-password-left" : "show-password";
    };

    const handleLogin = (data) => {
        AccountService.Login(data, setError).then((response) => response && window.location.reload(false));
    }

    return (
        <>
            <div className="row justify-content-center align-items-center m-1">
                <form onSubmit={handleSubmit((data) => handleLogin(data))}
                      className="auth-form" {...register("login")}>
                    <div className="auth-form-content row">
                        {AccountService.IsTokenExpired() && (
                            <div className="alert alert-info text-center" role="alert">
                                <ProfileText tid="session_expired"/>
                            </div>
                        )}
                        <h3 className="auth-form-title"><LoginText tid="title"/></h3>
                        <div className="col-md-6 mt-3">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="text"
                                name="email"
                                className="form-control"
                                {...register("email")}
                            />
                        </div>
                        <div className="col-md-6 mt-3">
                            <div className="position-relative">
                                <label htmlFor="password"><AccountText tid="password_input"/></label>
                                <input
                                    type={loginPasswordShown ? "text" : "password"}
                                    className="form-control"
                                    name="password"
                                    {...register("password")}
                                />
                                <div className={getShowPwdIcon()} onClick={() => {
                                    setLoginPasswordShown(!loginPasswordShown);
                                }
                                }>
                                    <i className={loginPasswordShown ? "bi bi-eye h5" : "bi bi-eye-slash h5"}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mt-3 text-center">
                            <button type="submit" className="btn btn-outline-dark btn-form">
                                <LoginText tid="button_text"/>
                            </button>
                        </div>
                    </div>
                    <hr/>
                    <div className="form-error">{errors?.login?.message}</div>
                    <div className="text-center">
                        <p className="auth-link-text">
                            <LoginText tid="not_registered_yet"/>{" "}
                            <a className="link" onClick={toRegister} href="#">
                                <LoginText tid="register_redirect"/>
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </>
    )
};

export default LoginForm;