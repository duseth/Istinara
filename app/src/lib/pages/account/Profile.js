import {AccountText, ProfileEditForm, ProfilePasswordForm, ProfileText} from "../../containers/Language";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import AccountService from "../../services/AccountService";
import ArticleCard from "../../components/articles/ArticleCard";
import React, {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {LanguageContext} from "../../../bin/context/Language";
import Article from "../../models/Article";
import api from "../../../config/API";
import User from "../../models/User";

const FAVOURITES_LIMIT = 6;

const ProfilePage = () => {
    const user: User = AccountService.GetCurrentUser();

    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const {register, setError, handleSubmit, formState: {errors}} = useForm();

    const [count, setCount] = useState(0);
    const [data: Array<Article>, setData] = useState();

    const [currentPasswordShown, setCurrentPasswordShown] = useState(false),
        [newPasswordShown, setNewPasswordShown] = useState(false),
        [acceptNewPasswordShown, setAcceptNewPasswordShown] = useState(false);

    useEffect(() => {
        if (AccountService.IsAuthorized()) {
            api.get(`/users/favourites?limit=${FAVOURITES_LIMIT}`)
                .then((response) => {
                    setCount(response.data?.count);
                    setData(response.data?.data);
                })
                .catch(() => setData([]));
        }
    }, []);

    const loadMore = () => {
        if (AccountService.IsAuthorized()) {
            api.get(`/users/favourites?offset=${data.length}&limit=${FAVOURITES_LIMIT}`)
                .then((response) => setData([...data, ...response.data.data]))
        }
    };

    const logout = () => {
        AccountService.Logout();
        window.location.reload(false)
    };

    const getRegistrationDate = (created_at: Date) => {
        const date = new Date(created_at),
            locale = lang === "ru" ? "ru-RU" : "ar-AE";

        return date.toLocaleDateString(locale, {day: "numeric", month: "long", year: 'numeric'})
    }

    const getShowPwdIcon = () => {
        return lang === "ar" ? "show-password-left" : "show-password";
    };

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
                        <button type="button" className="btn btn-outline-dark logout-button" onClick={logout}>
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
                                    <form onSubmit={handleSubmit((data) => AccountService.Update(data, setError))}
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
                                            {data.map((article) => ArticleCard(data, article, lang))}
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

export default ProfilePage;