import ru from './ru.json';
import ar from './ar.json';
import {createContext} from "react";

export const dictionaryList = {ru, ar};
export const languageOptions = {
    ru: "Русский",
    ar: "عرب"
}

export const LanguageContext = createContext({
    userLanguage: "ru",
    dictionary: dictionaryList.ru
});