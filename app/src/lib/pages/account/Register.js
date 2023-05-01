import React, {useContext, useState} from "react";
import {useForm} from "react-hook-form";

import AccountService from "../../services/AccountService";
import {LanguageContext} from "../../../bin/context/Language";
import {AccountText, RegisterText} from "../../containers/Language";

const RegisterForm = ({toLogin}) => {
    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const [registerPasswordShown, setRegisterPasswordShown] = useState(false),
        [acceptPasswordShown, setAcceptPasswordShown] = useState(false);

    const {register, setError, handleSubmit, formState: {errors}} = useForm();

    const getShowPwdIcon = () => {
        return lang === "ar" ? "show-password-left" : "show-password";
    };

    const handleRegister = (data) => {
        AccountService.Register(data, setError).then((response) => response && toLogin());
    }

    return (
        <>
            <div className="row justify-content-center align-items-center m-1">
                <form onSubmit={handleSubmit((data) => handleRegister(data))}
                      className="auth-form" {...register("register")}>
                    <div className="auth-form-content row">
                        <h3 className="auth-form-title"><RegisterText tid="title"/></h3>
                        <div className="col-md-6 mt-3">
                            <label htmlFor="username"><AccountText tid="name_input"/></label>
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                {...register("username")}
                            />
                        </div>
                        <div className="col-md-6 mt-3">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="text"
                                className="form-control"
                                name="email"
                                {...register("email")}
                            />
                        </div>
                        <div className="col-md-6 mt-3">
                            <div className="position-relative">
                                <label htmlFor="password"><AccountText tid="password_input"/></label>
                                <input
                                    type={registerPasswordShown ? "text" : "password"}
                                    className="form-control"
                                    name="password"
                                    {...register("password")}
                                />
                                <div className={getShowPwdIcon()} onClick={() => {
                                    setRegisterPasswordShown(!registerPasswordShown);
                                }
                                }>
                                    <i className={registerPasswordShown ? "bi bi-eye h5" : "bi bi-eye-slash h5"}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mt-3">
                            <div className="position-relative">
                                <label htmlFor="accept_password">
                                    <AccountText tid="accept_password"/>
                                </label>
                                <input
                                    type={acceptPasswordShown ? "text" : "password"}
                                    className="form-control"
                                    name="accept_password"
                                    {...register("accept_password")}
                                />
                                <div className={getShowPwdIcon()} onClick={() => {
                                    setAcceptPasswordShown(!acceptPasswordShown);
                                }
                                }>
                                    <i className={acceptPasswordShown ? "bi bi-eye h5" : "bi bi-eye-slash h5"}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mt-3 text-center">
                            <button type="submit" className="btn btn-outline-dark btn-form">
                                <RegisterText tid="button_text"/>
                            </button>
                        </div>
                    </div>
                    <hr/>
                    <div className="form-error">{errors?.register?.message}</div>
                    <div className="text-center">
                        <p className="auth-link-text">
                            <RegisterText tid="already_registered"/>{" "}
                            <a className="link" onClick={toLogin} href="#">
                                <RegisterText tid="login_redirect"/>
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </>
    )
};

export default RegisterForm;