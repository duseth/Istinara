import ru from '../../config/language/ru.json';
import ar from '../../config/language/ar.json';
import {createContext} from "react";

export const DictionaryList = {ru, ar};

export const LanguageContext = createContext(
    {
        userLanguage: "ru",
        dictionary: DictionaryList.ru
    }
);