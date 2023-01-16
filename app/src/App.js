import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

// Import styles
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import scripts
import 'bootstrap/dist/js/bootstrap.min.js';

// Import ReactJS components
import Auth from "./components/auth/Auth";
import Home from './components/index/Index';
import About from './components/about/About';
import Contacts from './components/contacts/Contacts';
import Footer from './components/shared/footer/Footer';
import Navbar from './components/shared/navbar/Navbar';
import Contribution from "./components/contribution/Contribution";
import {LanguageProvider} from "./containers/Language";
import AuthService from "./services/AuthService";
import AuthVerify from "./components/auth/AuthVerify";

function App() {
    return (
        <Router>
            <LanguageProvider>
                <Navbar/>
                <Routes>
                    <Route exact path='/' element={<Home/>}/>
                    <Route path='/about' element={<About/>}/>
                    <Route path='/contacts' element={<Contacts/>}/>
                    <Route path="/account" element={<Auth/>}/>
                    <Route path="/contribution" element={<Contribution/>}/>
                </Routes>
                <Footer/>
            </LanguageProvider>
            <AuthVerify logout={AuthService.Logout}/>
        </Router>
    );
}

export default App;