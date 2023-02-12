import React, {useContext, useEffect, useState} from "react"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {useForm} from "react-hook-form";

import './Auth.scss'
import AccountService from "../../services/AccountService";
import {LanguageContext} from "../../languages/Language";
import {
    AccountText,
    LoginText,
    ProfileEditForm,
    ProfilePasswordForm,
    ProfileText,
    RegisterText
} from "../../containers/Language";

const Auth = () => {
    let languageContext = useContext(LanguageContext);
    let [rerender, setRerender] = useState(false);

    const [loginPasswordShown, setLoginPasswordShown] = useState(false),
        [registerPasswordShown, setRegisterPasswordShown] = useState(false),
        [currentPasswordShown, setCurrentPasswordShown] = useState(false),
        [newPasswordShown, setNewPasswordShown] = useState(false),
        [acceptPasswordShown, setAcceptPasswordShown] = useState(false),
        [acceptNewPasswordShown, setAcceptNewPasswordShown] = useState(false);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["profile"] + " • Istinara";
    }, [languageContext]);

    let [authMode, setAuthMode] = useState("sign-in")
    const changeAuthMode = () => {
        setAuthMode(authMode === "sign-in" ? "sign-up" : "sign-in");
        reset();
    };

    const getRegistrationDate = (created_at: Date) => {
        const date = new Date(created_at),
            locale = languageContext.userLanguage === "ru" ? "ru-RU" : "ar-AE";

        return date.toLocaleDateString(locale, {day: "numeric", month: "long", year: 'numeric'})
    }

    const logout = () => {
        AccountService.Logout();
        setRerender(!rerender);
        reset();
    };

    const {register, reset, setError, handleSubmit, formState: {errors}} = useForm();

    let user = AccountService.GetCurrentUser();
    if (user != null) {
        return (
            <section className="auth-container">
                <div className="container py-3">
                    <div className="row justify-content-center align-items-center m-3">
                        <div className="col-1 account-image">
                            <i className="bi bi-person-circle account-bi-icon"/>
                        </div>
                        <div className="col-5">
                            <div className="account-name">{user.username}</div>
                            <div className="account-registration">
                                <ProfileText tid="registration_date"/> {getRegistrationDate(user.created_at)}
                            </div>
                        </div>
                        <div className="col-2">
                            <button type="button" className="btn btn-outline-dark logout-button"
                                    onClick={logout}>
                                <i className="bi bi-box-arrow-right logout-bi-icon"/> <ProfileText tid="logout"/>
                            </button>
                        </div>
                    </div>
                    <hr/>
                    <div className="container">
                        <div className="account-nav col-8">
                            <Tabs className="account-nav-items justify-content-center align-items-center"
                                  defaultActiveKey="profile">
                                <Tab tabClassName="account-nav-item" eventKey="profile"
                                     title={<ProfileText tid="nav_profile"/>}>
                                    <div className="row d-flex justify-content-center align-items-center mb-4">
                                        <form onSubmit={handleSubmit((data) => AccountService.Edit(data, setError))}
                                              className="auth-form" {...register("edit_profile")}>
                                            <div className="auth-form-content">
                                                <h3 className="auth-form-title">
                                                    <ProfileEditForm tid="title"/>
                                                </h3>
                                                <div className="form-group mt-3 w-50">
                                                    <label htmlFor="username">
                                                        <AccountText tid="name_input"/>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control mt-1"
                                                        name="username"
                                                        defaultValue={user.username}
                                                        {...register("username")}
                                                    />
                                                </div>
                                                <div className="form-group mt-3 w-50">
                                                    <label htmlFor="email">E-mail</label>
                                                    <input
                                                        type="text"
                                                        className="form-control mt-1"
                                                        name="email"
                                                        defaultValue={user.email}
                                                        {...register("email")}
                                                    />
                                                </div>
                                                <div className="d-grid gap-2 mt-3">
                                                    <button type="submit" className="auth-form-button">
                                                        <ProfileEditForm tid="button_text"/>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="form-error">{errors?.edit_profile?.message}</div>
                                        </form>
                                    </div>
                                    <div className="row d-flex justify-content-center align-items-center">
                                        <form
                                            onSubmit={handleSubmit((data) => AccountService.ChangePassword(data, setError))}
                                            className="auth-form" {...register("change_password")}>
                                            <div className="auth-form-content">
                                                <h3 className="auth-form-title">
                                                    <ProfilePasswordForm tid="title"/>
                                                </h3>
                                                <div className="password_input w-50 m-1">
                                                    <label htmlFor="current_password">
                                                        <ProfilePasswordForm tid="current_password"/>
                                                    </label>
                                                    <input
                                                        type={currentPasswordShown ? "text" : "password"}
                                                        className="form-control"
                                                        name="current_password"
                                                        {...register("current_password")}
                                                    />
                                                    <div className="show_password" onClick={() => {
                                                        setCurrentPasswordShown(!currentPasswordShown);
                                                    }
                                                    }>
                                                        <i className={currentPasswordShown ? "bi bi-eye h5" : "bi bi-eye-slash h5"}/>
                                                    </div>
                                                </div>
                                                <div className="password_input w-50 m-1">
                                                    <label htmlFor="new_password">
                                                        <ProfilePasswordForm tid="new_password"/>
                                                    </label>
                                                    <input
                                                        type={newPasswordShown ? "text" : "password"}
                                                        className="form-control"
                                                        name="new_password"
                                                        {...register("new_password")}
                                                    />
                                                    <div className="show_password" onClick={() => {
                                                        setNewPasswordShown(!newPasswordShown);
                                                    }
                                                    }>
                                                        <i className={newPasswordShown ? "bi bi-eye h5" : "bi bi-eye-slash h5"}/>
                                                    </div>
                                                </div>
                                                <div className="password_input w-50 m-1">
                                                    <label htmlFor="accept_new_password">
                                                        <ProfilePasswordForm tid="accept_new_password"/>
                                                    </label>
                                                    <input
                                                        type={acceptNewPasswordShown ? "text" : "password"}
                                                        className="form-control"
                                                        name="accept_new_password"
                                                        {...register("accept_new_password")}
                                                    />
                                                    <div className="show_password" onClick={() => {
                                                        setAcceptNewPasswordShown(!acceptNewPasswordShown);
                                                    }
                                                    }>
                                                        <i className={acceptNewPasswordShown ? "bi bi-eye h5" : "bi bi-eye-slash h5"}/>
                                                    </div>
                                                </div>
                                                <div className="d-grid gap-2 mt-3">
                                                    <button type="submit" className="auth-form-button">
                                                        <ProfilePasswordForm tid="button_text"/>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="form-error">{errors?.change_password?.message}</div>
                                        </form>
                                    </div>
                                </Tab>
                                <Tab tabClassName="account-nav-item" eventKey="favourite"
                                     title={<ProfileText tid="nav_favourite"/>}>
                                    <div className="account-tab-content">Избранное</div>
                                </Tab>
                            </Tabs>
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
                        <form onSubmit={handleSubmit((data) => AccountService.Login(data, setError))}
                              className="auth-form" {...register("login")}>
                            <div className="auth-form-content">
                                <h3 className="auth-form-title"><LoginText tid="title"/></h3>
                                <div className="form-group mt-3">
                                    <label htmlFor="email">E-mail</label>
                                    <input
                                        type="text"
                                        name="email"
                                        className="form-control mt-1"
                                        {...register("email")}
                                    />
                                </div>
                                <div className="form-group mt-3 flex">
                                    <div className="password_input">
                                        <label htmlFor="password"><AccountText tid="password_input"/></label>
                                        <input
                                            type={loginPasswordShown ? "text" : "password"}
                                            className="form-control"
                                            name="password"
                                            {...register("password")}
                                        />
                                        <div className="show_password" onClick={() => {
                                            setLoginPasswordShown(!loginPasswordShown);
                                        }
                                        }>
                                            <i className={loginPasswordShown ? "bi bi-eye h5" : "bi bi-eye-slash h5"}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-grid gap-2 mt-3">
                                    <button type="submit" className="auth-form-button">
                                        <LoginText tid="button_text"/>
                                    </button>
                                </div>
                            </div>
                            <div className="form-error">{errors?.login?.message}</div>
                            <div className="text-center">
                                <p className="link-text">
                                    <LoginText tid="not_registered_yet"/>{" "}
                                    <a className="link" onClick={changeAuthMode} href="#">
                                        <LoginText tid="register_redirect"/>
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
                    <form onSubmit={handleSubmit((data) => AccountService.Register(data, setError, changeAuthMode))}
                          className="auth-form" {...register("register")}>
                        <div className="auth-form-content">
                            <h3 className="auth-form-title"><RegisterText tid="title"/></h3>
                            <div className="form-group mt-2">
                                <label htmlFor="username"><AccountText tid="name_input"/></label>
                                <input
                                    type="text"
                                    className="form-control mt-1"
                                    name="username"
                                    {...register("username")}
                                />
                            </div>
                            <div className="form-group mt-2">
                                <label htmlFor="email">E-mail</label>
                                <input
                                    type="text"
                                    className="form-control mt-1"
                                    name="email"
                                    {...register("email")}
                                />
                            </div>
                            <div className="password_input mt-2">
                                <label htmlFor="password"><AccountText tid="password_input"/></label>
                                <input
                                    type={registerPasswordShown ? "text" : "password"}
                                    className="form-control mt-1"
                                    name="password"
                                    {...register("password")}
                                />
                                <div className="show_password" onClick={() => {
                                    setRegisterPasswordShown(!registerPasswordShown);
                                }
                                }>
                                    <i className={registerPasswordShown ? "bi bi-eye h5" : "bi bi-eye-slash h5"}/>
                                </div>
                            </div>
                            <div className="password_input mt-2">
                                <label htmlFor="accept_password">
                                    <AccountText tid="accept_password"/>
                                </label>
                                <input
                                    type={acceptPasswordShown ? "text" : "password"}
                                    className="form-control mt-1"
                                    name="accept_password"
                                    {...register("accept_password")}
                                />
                                <div className="show_password" onClick={() => {
                                    setAcceptPasswordShown(!acceptPasswordShown);
                                }
                                }>
                                    <i className={acceptPasswordShown ? "bi bi-eye h5" : "bi bi-eye-slash h5"}/>
                                </div>
                            </div>
                            <div className="d-grid gap-2 mt-3">
                                <button type="submit" className="auth-form-button">
                                    <RegisterText tid="button_text"/>
                                </button>
                            </div>
                        </div>
                        <div className="form-error">{errors?.register?.message}</div>
                        <div className="text-center">
                            <p className="link-text">
                                <RegisterText tid="already_registered"/>{" "}
                                <a className="link" onClick={changeAuthMode} href="#">
                                    <RegisterText tid="login_redirect"/>
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