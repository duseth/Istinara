import React from 'react';

import './Footer.scss'
import LanguageSelector from "../../../languages/LanguageSelector";
import {FooterLink, FooterText} from "../../../containers/Language";

const Footer = () => {
    return (
        <footer className="site-footer text-center">
            <div className="container p-4 my-2">
                <a className="col-md-4 m-auto" href="/">
                    <img src={`${window.location.protocol}//${window.location.host}/images/footer.svg`} alt="Istinara"/>
                </a>
                <ul className="nav justify-content-center border-bottom mb-3 py-1">
                    <li className="nav-item p-0">
                        <a href="/about" className="nav-link footer-text px-2"><FooterLink tid="about"/></a>
                    </li>
                    <li className="nav-item p-0">
                        <a href="/team" className="nav-link footer-text px-2"><FooterLink tid="team"/></a>
                    </li>
                    <li className="nav-item p-0">
                        <a href="/contacts" className="nav-link footer-text px-2"><FooterLink tid="contacts"/></a>
                    </li>
                    <li className="nav-item p-0">
                        <a target="_blank" href="//istinara.ru/api/docs/index.html"
                           className="nav-link footer-text px-2">
                            <FooterLink tid="docs"/>
                        </a>
                    </li>
                </ul>
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-2 my-2">
                        <LanguageSelector/>
                    </div>
                    <div className="col-md-8 my-2">
                        <p className="copyright-text">
                            <FooterText tid="information"/><br/>
                            &copy; Istinara, {new Date(Date.now()).getFullYear()} <FooterText tid="rights"/>
                        </p>
                    </div>
                    <div className="col-md-2 my-2">
                        <a href="#" className="nav-link footer-text"><FooterText tid="back-to-top"/></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;