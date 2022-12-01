import React, {useContext} from 'react';
import {LanguageContext, languageOptions} from '../../languages/Language';

function LanguageSelector() {
    const {userLanguage, userLanguageChange} = useContext(LanguageContext);
    const handleLanguageChange = e => userLanguageChange(e.target.value);
    return (
        <select className="form-select form-select-sm" onChange={handleLanguageChange} value={userLanguage}>
            {Object.entries(languageOptions).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
            ))}
        </select>
    )
}

export default LanguageSelector;