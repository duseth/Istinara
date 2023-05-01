import React from 'react';
import {Toaster} from "react-hot-toast";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

// Import styles
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import scripts
import 'bootstrap/dist/js/bootstrap.min.js';

// Import ReactJS components
import WelcomePage from './lib/pages/index/Index';

import Footer from './lib/components/footer/Footer';
import Header from './lib/components/header/Header';

import TeamPage from "./lib/pages/team/Page";
import AboutPage from './lib/pages/about/Page';
import ContactsPage from './lib/pages/contacts/Page';
import AccountPage from "./lib/pages/account/Account";
import ContributionPage from "./lib/pages/contribution/Page";

import AuthorPage from "./lib/pages/authors/Page";
import AuthorsListPage from "./lib/pages/authors/List";

import WorkPage from "./lib/pages/works/Page";
import WorksListPage from "./lib/pages/works/List";

import ArticlePage from "./lib/pages/articles/Page";
import ArticlesListPage from "./lib/pages/articles/List";

import {LanguageProvider} from "./lib/containers/Language";


function App() {
    return (
        <Router>
            <LanguageProvider>
                <Toaster/>
                <Header/>
                <main>
                    <Routes>
                        <Route exact path='/' element={<WelcomePage/>}/>

                        <Route path='/authors' element={<AuthorsListPage/>}/>
                        <Route path='/authors/:link' element={<AuthorPage/>}/>

                        <Route path='/works' element={<WorksListPage/>}/>
                        <Route path='/works/:link' element={<WorkPage/>}/>

                        <Route path='/articles' element={<ArticlesListPage/>}/>
                        <Route path='/articles/:link' element={<ArticlePage/>}/>

                        <Route path='/about' element={<AboutPage/>}/>
                        <Route path='/team' element={<TeamPage/>}/>
                        <Route path="/account" element={<AccountPage/>}/>
                        <Route path='/contacts' element={<ContactsPage/>}/>
                        <Route path="/contribution" element={<ContributionPage/>}/>
                    </Routes>
                </main>
                <Footer/>
            </LanguageProvider>
        </Router>
    );
}

export default App;