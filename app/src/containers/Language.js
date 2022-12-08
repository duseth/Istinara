import {useContext, useState} from "react";
import {dictionaryList, LanguageContext} from "../languages/Language";

export function LanguageProvider({children}) {
    const defaultLanguage = window.localStorage.getItem("lang");
    const [userLanguage, setUserLanguage] = useState(defaultLanguage || "ru");

    const provider = {
        userLanguage, dictionary: dictionaryList[userLanguage],
        "userLanguageChange": (selected) => {
            setUserLanguage(selected);
            window.localStorage.setItem("lang", selected);
        }
    };
    return (
        <LanguageContext.Provider value={provider}>
            {children}
        </LanguageContext.Provider>
    );
}

export function Header({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["header"][tid] || tid;
}

export function FooterLink({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["footer"]["links"][tid] || tid;
}

export function FooterText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["footer"][tid] || tid;
}

export function Account({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["account"][tid] || tid;
}

export function About({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["about"][tid] || tid;
}