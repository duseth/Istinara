import React, {useContext} from 'react';
import {LanguageContext} from './Language';

const LanguageSelector = () => {
    const {userLanguage, userLanguageChange} = useContext(LanguageContext);

    return (
        <div className="language" role="radiogroup" aria-labelledby="language-switcher">
            <label className="language-container-left language-container-ru">
                <input className="language-control" type="radio" id="language-ru" name="language-switch"
                       checked={userLanguage === "ru"} onChange={() => userLanguageChange("ru")}/>
                <img className="flag-image" src="/flags/ru.jpg" alt="ru"/>
            </label>
            <label className="language-container-right language-container-ar">
                <input className="language-control" type="radio" id="language_ar" name="language-switch"
                       checked={userLanguage === "ar"} onChange={() => userLanguageChange("ar")}/>
                <img className="flag-image" src="/flags/ar.jpg" alt="ar"/>
            </label>
        </div>
    )
}

export default LanguageSelector;