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

// Welcome
export function WelcomeText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["home"][tid] || tid;
}

// Header
export function HeaderLink({tid}) {
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

// General
export function GeneralForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["general"]["form"][tid] || tid;
}

// Account
export function AccountText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["account"][tid] || tid;
}

export function ProfileText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["account"]["profile"][tid] || tid;
}

export function ProfileEditForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["account"]["profile"]["edit_form"][tid] || tid;
}

export function ProfilePasswordForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["account"]["profile"]["password_form"][tid] || tid;
}

export function LoginText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["account"]["login"][tid] || tid;
}

export function RegisterText({tid}) {
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

// Team
export function TeamText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["team"][tid] || tid;
}

// Authors
export function AuthorsText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["authors"][tid] || tid;
}

export function AuthorsForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["authors"]["form"][tid] || tid;
}

export function AuthorsCreateForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["authors"]["form"]["create"][tid] || tid;
}

export function AuthorsUpdateForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["authors"]["form"]["update"][tid] || tid;
}

export function AuthorsDeleteForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["authors"]["form"]["delete"][tid] || tid;
}

export function AuthorsPage({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["authors"]["page"][tid] || tid;
}

// Works
export function WorksText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["works"][tid] || tid;
}

export function WorksForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["works"]["form"][tid] || tid;
}

export function WorksCreateForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["works"]["form"]["create"][tid] || tid;
}

export function WorksUpdateForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["works"]["form"]["update"][tid] || tid;
}

export function WorksDeleteForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["works"]["form"]["delete"][tid] || tid;
}

export function WorksPage({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["works"]["page"][tid] || tid;
}

// Groups
export function GroupsForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["groups"]["form"][tid] || tid;
}

export function GroupsCreateForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["groups"]["form"]["create"][tid] || tid;
}

export function GroupsUpdateForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["groups"]["form"]["update"][tid] || tid;
}

export function GroupsDeleteForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["groups"]["form"]["delete"][tid] || tid;
}

// Articles
export function ArticlesText({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["articles"][tid] || tid;
}

export function ArticlesPage({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["articles"]["page"][tid] || tid;
}

export function ArticlesForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["articles"]["form"][tid] || tid;
}

export function ArticlesCreateForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["articles"]["form"]["create"][tid] || tid;
}

export function ArticlesUpdateForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["articles"]["form"]["update"][tid] || tid;
}

export function ArticlesCreateLinkForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["articles"]["form"]["link"]["create"][tid] || tid;
}

export function ArticlesDeleteLinkForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["articles"]["form"]["link"]["delete"][tid] || tid;
}

export function ArticlesDeleteForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["articles"]["form"]["delete"][tid] || tid;
}

export function ArticlesFeedbackForm({tid}) {
    const languageContext = useContext(LanguageContext);
    return languageContext.dictionary["articles"]["form"]["feedback"][tid] || tid;
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
