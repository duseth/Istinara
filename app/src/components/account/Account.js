import Tab from 'react-bootstrap/Tab';
import Cookies from "universal-cookie";
import Tabs from 'react-bootstrap/Tabs';
import {useForm} from "react-hook-form";
import React, {useContext, useEffect, useState} from "react"

import {
    AccountText,
    LoginText,
    ProfileEditForm,
    ProfilePasswordForm,
    ProfileText,
    RegisterText
} from "../../containers/Language";
import './Account.scss'
import API from "../../services/API";
import {User} from "../../models/User";
import {Article} from "../../models/Article";
import {LanguageContext} from "../../languages/Language";
import AccountService from "../../services/AccountService";
import ArticleService from "../../services/ArticleService";

const FAVOURITES_LIMIT = 6;

const AccountPage = () => {
    const cookies = new Cookies();
    const user: User = AccountService.GetCurrentUser();
    const configHeader = AccountService.GetHeaders(true, true)

    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;
    const [rerender, setRerender] = useState(false);

    const [count, setCount] = useState(0);
    const [data: Array<Article>, setData] = useState();
    const [authMode, setAuthMode] = useState("sign-in")

    const [loginPasswordShown, setLoginPasswordShown] = useState(false),
        [registerPasswordShown, setRegisterPasswordShown] = useState(false),
        [currentPasswordShown, setCurrentPasswordShown] = useState(false),
        [newPasswordShown, setNewPasswordShown] = useState(false),
        [acceptPasswordShown, setAcceptPasswordShown] = useState(false),
        [acceptNewPasswordShown, setAcceptNewPasswordShown] = useState(false);

    const {register, reset, setError, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["profile"] + " • Istinara";
    }, [languageContext]);

    useEffect(() => {
        if (cookies.get("token") !== undefined) {
            API.get(`/user/favourites?offset=0&limit=${FAVOURITES_LIMIT}&sort_by=created_at.desc`, configHeader)
                .then((response) => {
                    setCount(response.data?.count);
                    setData(response.data?.data);
                })
                .catch(() => setData([]));
        }
    }, [cookies.get("token")]);

    const loadMore = () => {
        API.get(`/user/favourites?offset=${data.length}&limit=${FAVOURITES_LIMIT}&sort_by=created_at.desc`, configHeader)
            .then((response) => setData([...data, ...response.data.data]))
    };

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

    const getShowPwdIcon = () => {
        return languageContext.userLanguage === "ar" ? "show-password-left" : "show-password";
    };

    const ProfileSection = () => {
        return (
            <section className="main-container">
                <div className="container py-3">
                    <div className="row justify-content-center align-items-center m-3 profile-header m-auto">
                        <div className="col-md-2 m-2">
                            <i className="bi bi-person-circle account-bi-icon"/>
                        </div>
                        <div className="col-md-7 m-2">
                            <div className="account-name">{user.username}</div>
                            <div className="account-registration">
                                <ProfileText tid="registration_date"/>: {getRegistrationDate(user.created_at)}
                            </div>
                        </div>
                        <div className="col-md-2 m-2">
                            <button type="button" className="btn btn-outline-dark logout-button"
                                    onClick={logout}>
                                <i className="bi bi-box-arrow-right logout-bi-icon"/> <ProfileText tid="logout"/>
                            </button>
                        </div>
                    </div>
                    <hr className="w-75 m-auto"/>
                    <div className="container">
                        <div className="account-nav col-8">
                            <Tabs className="account-nav-items justify-content-center align-items-center"
                                  defaultActiveKey="profile">
                                <Tab tabClassName="account-nav-item" eventKey="profile"
                                     title={<ProfileText tid="nav_profile"/>}>
                                    <div className="row justify-content-center align-items-center mb-4">
                                        <form onSubmit={handleSubmit((data) => AccountService.Edit(data, setError))}
                                              className="auth-form" {...register("edit_profile")}>
                                            <div className="auth-form-content row">
                                                <h3 className="auth-form-title">
                                                    <ProfileEditForm tid="title"/>
                                                </h3>
                                                <div className="col-md-6 mt-3">
                                                    <label htmlFor="username">
                                                        <AccountText tid="name_input"/>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="username"
                                                        defaultValue={user.username}
                                                        {...register("username")}
                                                    />
                                                </div>
                                                <div className="col-md-6 mt-3">
                                                    <label htmlFor="email">E-mail</label>
                                                    <input
                                                        type="text"
                                                        className="form-control mt-1"
                                                        name="email"
                                                        defaultValue={user.email}
                                                        {...register("email")}
                                                    />
                                                </div>
                                                <div className="col-md-6 mt-3 text-center">
                                                    <button type="submit" className="btn btn-outline-dark btn-form">
                                                        <ProfileEditForm tid="button_text"/>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="form-error">{errors?.edit_profile?.message}</div>
                                        </form>
                                    </div>
                                    <div className="row justify-content-center align-items-center">
                                        <form className="auth-form" {...register("change_password")}
                                            onSubmit={handleSubmit((data) => AccountService.ChangePassword(data, setError))}>
                                            <div className="auth-form-content row">
                                                <h3 className="auth-form-title">
                                                    <ProfilePasswordForm tid="title"/>
                                                </h3>
                                                <div className="col-md-6 mt-3">
                                                    <div className="position-relative">
                                                        <label htmlFor="current_password">
                                                            <ProfilePasswordForm tid="current_password"/>
                                                        </label>
                                                        <input
                                                            type={currentPasswordShown ? "text" : "password"}
                                                            className="form-control"
                                                            name="current_password"
                                                            {...register("current_password")}
                                                        />
                                                        <div className={getShowPwdIcon()} onClick={() => {
                                                            setCurrentPasswordShown(!currentPasswordShown);
                                                        }
                                                        }>
                                                            <i className={currentPasswordShown ? "bi bi-eye h5" : "bi bi-eye-slash h5"}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mt-3">
                                                    <div className="position-relative">
                                                        <label htmlFor="new_password">
                                                            <ProfilePasswordForm tid="new_password"/>
                                                        </label>
                                                        <input
                                                            type={newPasswordShown ? "text" : "password"}
                                                            className="form-control"
                                                            name="new_password"
                                                            {...register("new_password")}
                                                        />
                                                        <div className={getShowPwdIcon()} onClick={() => {
                                                            setNewPasswordShown(!newPasswordShown);
                                                        }
                                                        }>
                                                            <i className={newPasswordShown ? "bi bi-eye h5" : "bi bi-eye-slash h5"}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mt-3">
                                                    <div className="position-relative">
                                                        <label htmlFor="accept_new_password">
                                                            <ProfilePasswordForm tid="accept_new_password"/>
                                                        </label>
                                                        <input
                                                            type={acceptNewPasswordShown ? "text" : "password"}
                                                            className="form-control"
                                                            name="accept_new_password"
                                                            {...register("accept_new_password")}
                                                        />
                                                        <div className={getShowPwdIcon()} onClick={() => {
                                                            setAcceptNewPasswordShown(!acceptNewPasswordShown);
                                                        }
                                                        }>
                                                            <i className={acceptNewPasswordShown ? "bi bi-eye h5" : "bi bi-eye-slash h5"}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mt-3 text-center">
                                                    <button type="submit" className="btn btn-outline-dark btn-form">
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
                                    {
                                        data !== undefined && data.length > 0 ? (
                                            <div
                                                className="row row-cols-md-2 justify-content-center align-items-center g-3 m-3">
                                                {data.map((article) => ArticleService.GetArticleCard(data, article, lang))}
                                            </div>
                                        ) : (
                                            <div className="information">
                                                <i className="bi bi-folder-x information-icon"></i>
                                                <p className="mt-3"><ProfileText tid="no_favourites"/></p>
                                            </div>
                                        )
                                    }
                                    {
                                        data?.length < count &&
                                        <div className="text-center m-3">
                                            <button className="btn btn-outline-dark" onClick={loadMore}>
                                                <ProfileText tid="show_more_favourites"/>
                                            </button>
                                        </div>
                                    }
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </section>
        )
    };

    const LoginSection = () => {
        return (
            <section className="main-container">
                <div className="container py-5">
                    <div className="row justify-content-center align-items-center m-1">
                        <form onSubmit={handleSubmit((data) => AccountService.Login(data, setError))}
                              className="auth-form" {...register("login")}>
                            <div className="auth-form-content row">
                                {cookies.get("token_expired") !== undefined && (
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
    };

    const RegisterSection = () => {
        return (
            <section className="main-container">
                <div className="container py-5">
                    <div className="row justify-content-center align-items-center m-1">
                        <form onSubmit={handleSubmit((data) => AccountService.Register(data, setError, changeAuthMode))}
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
    };

    if (user != null) {
        if (cookies.get("token") !== undefined) {
            return ProfileSection();
        } else {
            localStorage.removeItem("user");
            cookies.set("token_expired", true, {maxAge: 10});
            return LoginSection();
        }
    }

    if (authMode === "sign-in") {
        return LoginSection();
    }

    return RegisterSection();
}

export default AccountPage