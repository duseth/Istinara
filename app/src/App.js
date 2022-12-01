import React, {useEffect, useState} from 'react';
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
import {LanguageProvider} from "./containers/Language";

function App() {
    const [windowDimension, setWindowDimension] = useState(null);

    useEffect(() => {
        setWindowDimension(window.innerWidth);
    }, []);

    useEffect(() => {
        function handleResize() {
            setWindowDimension(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = windowDimension <= 640;

    return (
        <Router>
            <LanguageProvider>
                <Navbar/>
                <Routes>
                    <Route exact path='/' element={<Home/>}/>
                    <Route path='/about' element={<About/>}/>
                    <Route path='/contacts' element={<Contacts/>}/>
                    <Route path="/account" element={<Auth/>}/>
                </Routes>
                <Footer/>
            </LanguageProvider>
        </Router>
    );
}

export default App;