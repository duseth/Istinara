import React, {useContext, useRef, useState} from "react";

import './Header.scss'
import {LanguageContext} from "../../../bin/context/Language";
import {HeaderLink} from "../../containers/Language";

const Header = () => {
    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;
    const search_placeholder = languageContext.dictionary["header"]["search_placeholder"]
    const iconX = "bi bi-x-lg nav-bi-icon", iconS = "bi bi-search nav-bi-icon";

    const [searchIcon, setSearchIcon] = useState(iconS);
    const changeSearchIcon = () => {
        setSearchIcon(searchIcon === iconS ? iconX : iconS);
    };

    const useFocus = () => {
        const htmlElRef = useRef(null)
        const setFocus = () => {
            changeSearchIcon()
            htmlElRef.current && htmlElRef.current.focus()
        }

        return [htmlElRef, setFocus]
    }
    const [inputRef, setInputFocus] = useFocus()

    const submitSearch = () => {
        const form = document.getElementById("search");
        form.action = "/articles?query=" + document.getElementsByName("query")[0].value;
    }

    return (
        <header>
            <nav className="navbar navbar-expand-md navbar-dark bg-black py-1">
                <button className="navbar-toggler m-2" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false">
                    <i className="bi bi-list"/>
                </button>
                <a className="mx-2 text-center" href="/">
                    <img className="header-logo" src="/logo.svg" alt="Istinara"></img>
                </a>
                <div className={lang === "ru" ? "collapse navbar-collapse text-start"
                    : "collapse navbar-collapse text-end"} id="navbarCollapse">
                    <ul className="navbar-nav col mx-2">
                        <li className="nav-item">
                            <a className="nav-link nav-header-link" href="/authors"><HeaderLink tid="authors"/></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link nav-header-link" href="/works"><HeaderLink tid="works"/></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link nav-header-link" href="/articles"><HeaderLink tid="articles"/></a>
                        </li>
                    </ul>
                    <div className="d-flex mx-auto">
                        <div className="nav-item">
                            <a className="nav-link nav-icon" href="/contribution">
                                <i className="bi bi-exclude nav-bi-icon"></i>
                            </a>
                        </div>
                        <div className="navbar-vertical-separator"/>
                        <div className="nav-item">
                            <a className="nav-link nav-icon" href="/account">
                                <i className="bi bi-person-circle nav-bi-icon"></i>
                            </a>
                        </div>
                        <div className="navbar-vertical-separator"/>
                        <div className="nav-item">
                            <a className="nav-link nav-icon" data-bs-toggle="collapse" href={"#search"} role="button"
                               onClick={setInputFocus} aria-expanded="false" aria-controls="search">
                                <i className={searchIcon + " nav-bi-icon"}/>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
            <form className="collapse container-fluid p-0 shadow-lg bg-light" id="search">
                <div className="input-group border-5 rounded-0">
                    <input ref={inputRef} className="form-control border-0 rounded-0 shadow-none bg-light"
                           required="required" placeholder={search_placeholder} type="search" name="query"/>
                    <button className="btn btn-default rounded-0 shadow-none" type="submit" onClick={submitSearch}>
                        <i className="bi bi-search text-black fs-5"></i>
                    </button>
                </div>
            </form>
        </header>
    );
};

export default Header;