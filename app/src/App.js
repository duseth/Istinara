import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

// Import styles
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import scripts
import 'bootstrap/dist/js/bootstrap.min.js';

// Import ReactJS components
import Account from "./components/account/Account";
import {Author, Authors} from "./components/authors/Authors";
import {Work, Works} from "./components/works/Works";
import {Article, Articles} from "./components/articles/Articles";
import Home from './components/index/Index';
import About from './components/about/About';
import Contacts from './components/contacts/Contacts';
import Footer from './components/shared/footer/Footer';
import Navbar from './components/shared/navbar/Navbar';
import Contribution from "./components/contribution/Contribution";
import {LanguageProvider} from "./containers/Language";
import {Toaster} from "react-hot-toast";

function App() {
    return (
        <Router>
            <LanguageProvider>
                <Toaster/>
                <Navbar/>
                <Routes>
                    <Route exact path='/' element={<Home/>}/>
                    <Route path='/about' element={<About/>}/>
                    <Route path='/authors' element={<Authors/>}/>
                    <Route path='/authors/:link' element={<Author/>}/>
                    <Route path='/works' element={<Works/>}/>
                    <Route path='/works/:link' element={<Work/>}/>
                    <Route path='/articles' element={<Articles/>}/>
                    <Route path='/articles/:link' element={<Article/>}/>
                    <Route path='/contacts' element={<Contacts/>}/>
                    <Route path="/account" element={<Account/>}/>
                    <Route path="/contribution" element={<Contribution/>}/>
                </Routes>
                <Footer/>
            </LanguageProvider>
        </Router>
    );
}

export default App;