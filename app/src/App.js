import React from 'react';
import {Toaster} from "react-hot-toast";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

// Import styles
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import scripts
import 'bootstrap/dist/js/bootstrap.min.js';

// Import ReactJS components
import AboutPage from './components/about/About';
import AccountPage from "./components/account/Account";
import WelcomePage from './components/index/Index';
import {WorkPage, WorksListPage} from "./components/works/Works";
import ContactsPage from './components/contacts/Contacts';
import {LanguageProvider} from "./containers/Language";
import Footer from './components/shared/footer/Footer';
import Header from './components/shared/header/Header';
import {ArticlePage, ArticlesListPage} from "./components/articles/Articles";
import ContributionPage from "./components/contribution/Contribution";
import {AuthorPage, AuthorsListPage} from "./components/authors/Authors";

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