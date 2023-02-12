import React, {useContext, useRef, useState} from "react";

import './Navbar.scss'
import {LanguageContext} from "../../../languages/Language";
import {HeaderLink} from "../../../containers/Language";
import LanguageSelector from "../LanguageSelector";

const Navbar = () => {
    const languageContext = useContext(LanguageContext);

    let iconX = "bi bi-x-lg nav-bi-icon icon-hover", iconS = "bi bi-search nav-bi-icon icon-hover";

    let [searchIcon, setSearchIcon] = useState(iconS);
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
    let search_placeholder = languageContext.dictionary["header"]["search_placeholder"]
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-black">
                <button className="navbar-toggler m-2" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false">
                    <i className="bi bi-list"></i>
                </button>

                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <a className="me-3 ms-3" href="/">
                        <i className="bi bi bi-globe-europe-africa logo-icon icon-hover"></i>
                    </a>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
                </div>

                <div className="d-flex align-items-center">
                    <div className="nav-item">
                        <div className="nav-link nav-icon">
                            <LanguageSelector/>
                        </div>
                    </div>
                    <div className="navbar-vertical-separator"/>
                    <div className="nav-item">
                        <a className="nav-link nav-icon" href="/contribution">
                            <i className="bi bi-exclude nav-bi-icon icon-hover"></i>
                        </a>
                    </div>
                    <div className="navbar-vertical-separator"/>
                    <div className="nav-item">
                        <a className="nav-link nav-icon" href="/account">
                            <i className="bi bi-person-circle nav-bi-icon icon-hover"></i>
                        </a>
                    </div>
                    <div className="navbar-vertical-separator"/>
                    <div className="nav-item">
                        <a className="nav-link nav-icon" data-bs-toggle="collapse" href={"#search"} role="button"
                           onClick={setInputFocus} aria-expanded="false" aria-controls="search">
                            <i className={searchIcon + "nav-bi-icon icon-hover"}/>
                        </a>
                    </div>
                </div>
            </nav>
            <form className="collapse container-fluid p-0 shadow-lg" id="search">
                <div className="input-group border-5 rounded-0">
                    <input ref={inputRef} className="form-control border-0 rounded-0 shadow-none"
                           placeholder={search_placeholder} type="search"/>
                    <button className="btn btn-default rounded-0 shadow-none" type="submit">
                        <i className="bi bi-search text-black fs-5"></i>
                    </button>
                </div>
            </form>
        </>
    );
};

export default Navbar;