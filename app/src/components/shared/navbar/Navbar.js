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
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                             id="svg193215" viewBox="0 0 40 54" height="54px" width="40px" version="1.1">
                            <g id="logo-center" transform="scale(0.4)">
                                <g id="title">
                                    <g id="path193224" aria-label="I"
                                       transform="translate(20 -30) scale(0.94) translate(-313.77262 0)">
                                        <path className="c1"
                                              d="M115.75258,136.00635h-8.55127h-7.20117h-7.20117h-0.00049h-8.55127 c4.72266,0,8.55078-4.5481,8.55127-9.27039v-53.4707c0-4.7229-3.82812-9.27167-8.55127-9.27167h8.55127h7.20166h7.20117h8.55127 c-4.72266,0-8.55127,4.54877-8.55127,9.27167v53.46948C107.20131,131.45758,111.02992,136.00635,115.75258,136.00635z"
                                              transform="translate(229.52541 0)" strokeWidth="0"
                                              strokeLinejoin="miter" strokeMiterlimit="2" fill="#fff"
                                              stroke="#fff"/>
                                    </g>
                                    <g id="path193226" aria-label="s"
                                       transform="translate(60 -30) scale(0.94) translate(-354.43584 0)">
                                        <path className="c3"
                                              d="M117.34755,92.93445c0,4.20632-3.4099,7.61622-7.61622,7.61622s-7.61622-3.4099-7.61622-7.61622 s3.4099-7.61622,7.61622-7.61622S117.34755,88.72813,117.34755,92.93445z"
                                              transform="translate(273.94596 0)" strokeWidth="0"
                                              strokeLinejoin="miter" strokeMiterlimit="2" fill="#a26927"
                                              stroke="#a26927"/>
                                        <path className="c1"
                                              d="M119.5099,122.80951c0,8.74921-10.27734,13.35468-10.27734,13.35468s3.82324-1.84766,3.82324-5.8479 c0-4.96466-7.7207-6.77521-18.42383-13.65338c-10.2124-6.56268-14.14209-10.83203-14.14209-18.82489 c0-6.47656,5.57617-9.79919,5.57617-9.79919s-1.43115,2.45056-1.43115,5.14062 C84.6349,104.49127,119.5099,104.49127,119.5099,122.80951z M81.6642,120.12848v16.59161 c0-2.30786,2.39575-2.13617,5.55518-1.26489c2.87524,0.83746,6.02026,1.26489,9.396,1.26489 C89.28432,136.72009,83.85121,129.64728,81.6642,120.12848z"
                                              transform="translate(273.94596 0)" strokeWidth="0"
                                              strokeLinejoin="miter" strokeMiterlimit="2" fill="#fff"
                                              stroke="#fff"/>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </a>
                    <ul className="navbar-nav mb-2 mb-lg-0">
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