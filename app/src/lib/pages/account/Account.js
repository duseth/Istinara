import Cookies from "universal-cookie";
import React, {useContext, useEffect, useState} from "react"

import './styles.scss'
import User from "../../models/User";
import {LanguageContext} from "../../../bin/context/Language";
import AccountService from "../../services/AccountService";
import LoginForm from "./Login";
import RegisterForm from "./Register";
import ProfilePage from "./Profile";


const AccountPage = () => {
    const cookies = new Cookies();
    const user: User = AccountService.GetCurrentUser();

    const languageContext = useContext(LanguageContext);
    const [authMode, setAuthMode] = useState("sign-in")

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["profile"] + " • Istinara";
    }, [languageContext]);

    const changeAuthMode = () => {
        setAuthMode(authMode === "sign-in" ? "sign-up" : "sign-in");
    };

    if (user != null) {
        if (cookies.get("token") !== undefined) {
            return ProfilePage();
        } else {
            localStorage.removeItem("user");
            cookies.set("token_expired", true, {maxAge: 10});
        }
    }

    return (
        <>
            <section className="main-container">
                <div className="container py-5">
                    {
                        authMode === "sign-in"
                            ? <LoginForm toRegister={changeAuthMode}/>
                            : <RegisterForm toLogin={changeAuthMode}/>
                    }
                </div>
            </section>
        </>
    );
}

export default AccountPage