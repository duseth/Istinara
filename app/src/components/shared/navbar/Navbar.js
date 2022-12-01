import React, {useContext, useRef} from "react";

import './Navbar.scss'
import LanguageSelector from "../LanguageSelector";
import {LanguageContext} from "../../../languages/Language";
import {Header} from "../../../containers/Language";

const Navbar = () => {
    const languageContext = useContext(LanguageContext);

    const useFocus = () => {
        const htmlElRef = useRef(null)
        const setFocus = () => {
            htmlElRef.current && htmlElRef.current.focus()
        }

        return [htmlElRef, setFocus]
    }

    const [inputRef, setInputFocus] = useFocus()
    let search_placeholder = languageContext.dictionary["header"]["search_placeholder"]
    return (
        <>
            <header className="p-3 bg-black text-white">
                <div className="container">
                    <div className="d-flex">
                        <a href="/" className="">
                            <img
                                alt="Istinara"
                                src={"logo.svg"}
                                width="32"
                                height="32"
                                className="d-inline-block align-top"
                            />
                        </a>
                        <ul className="nav col-12 col-lg-4 me-lg-auto justify-content-center mb-md-0">
                            <li>
                                <a href="/authors" className="nav-link px-3 text-white">
                                    <Header tid="authors"/>
                                </a>
                            </li>
                            <li>
                                <a href="/works" className="nav-link px-3 text-white">
                                    <Header tid="works"/>
                                </a>
                            </li>
                            <li>
                                <a href="/articles" className="nav-link px-3 text-white">
                                    <Header tid="articles"/>
                                </a>
                            </li>
                        </ul>
                        <ul className="nav col-lg-3 justify-content-center">
                            <div className="me-3">
                                <LanguageSelector/>
                            </div>
                            <div className="navbar-vertical-separator me-3"></div>
                            <a className="me-3" href="/account">
                                <img
                                    alt="Личный кабинет"
                                    src="/assets/icons/profile.svg"
                                    width="32"
                                    height="32"
                                    className="d-inline-block align-top"
                                />
                            </a>
                            <div className="navbar-vertical-separator me-3"></div>
                            <a className="me-3" data-bs-toggle="collapse" href={"#search"}
                               onClick={setInputFocus}
                               role="button" aria-expanded="false" aria-controls="search">
                                <img
                                    alt="Поиск"
                                    src="/assets/icons/search-white.svg"
                                    width="32"
                                    height="32"
                                    className="d-inline-block align-top"
                                />
                            </a>
                        </ul>
                    </div>
                </div>
            </header>
            <form className="collapse container-fluid p-0 shadow-lg" id="search">
                <div className="input-group border-5 rounded-0">
                    <input ref={inputRef} className="form-control border-0 rounded-0 shadow-none"
                           placeholder={search_placeholder} type="search"/>
                    <button className="btn btn-default rounded-0" type="submit">
                        <img
                            alt="Поиск"
                            src="/assets/icons/search-black.svg"
                            width="24"
                            height="24"
                            className="d-inline-block align-top"
                        />
                    </button>
                </div>
            </form>
        </>
    );
};

export default Navbar;