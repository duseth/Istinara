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

// Header
export function Header({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["header"][tid] || tid;
}

// Footer
export function FooterLink({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["footer"]["links"][tid] || tid;
}

export function FooterText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["footer"][tid] || tid;
}

// Account
export function Account({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["account"][tid] || tid;
}

export function Profile({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["account"]["profile"][tid] || tid;
}

export function Login({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["account"]["login"][tid] || tid;
}

export function Register({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["account"]["register"][tid] || tid;
}

// Contacts
export function ContactsText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["contacts"][tid] || tid;
}

// About
export function AboutText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["about"][tid] || tid;
}

// Authors
export function AuthorsText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["authors"][tid] || tid;
}

// Works
export function WorksText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["works"][tid] || tid;
}

// Articles
export function ArticlesText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["articles"][tid] || tid;
}

// Contribution
export function ContributionText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["contribution"][tid] || tid;
}

export function ContributionForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["contribution"]["form"][tid] || tid;
}
