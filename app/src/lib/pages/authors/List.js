import React, {useContext, useEffect, useState} from "react";
import {LanguageContext} from "../../../bin/context/Language";
import {Author} from "../../models/Author";
import {useForm} from "react-hook-form";
import api from "../../../config/API";
import {AuthorsCreateForm, AuthorsText, GeneralForm} from "../../containers/Language";
import AuthorService from "../../services/AuthorService";
import NotifyService from "../../services/NotifyService";
import AccountService from "../../services/AccountService";

import "./styles.scss"
import UpdateAuthorForm from "../../components/authors/UpdateAuthorForm";

const AUTHORS_LIMIT = 6;

const AuthorsListPage = () => {
    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const [rerender, setRerender] = useState(false);
    const [count, setCount] = useState(0);
    const [data: Array<Author>, setData] = useState()

    const {register, setError, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["authors"] + " • Istinara";
    }, [languageContext]);

    useEffect(() => {
        api.get(`/authors?offset=0&limit=${AUTHORS_LIMIT}&sort_by=${lang === "ru" ? "name_ru" : "name_ar"}`)
            .then((response) => {
                setCount(response.data.count);
                setData(response.data.data);
            })
            .catch(() => {
                setData([]);
            });
    }, [lang, rerender]);

    if (!data) {
        return (
            <div className="album">
                <div className="container">
                    <div className="row justify-content-center align-items-center m-3">
                        <div className="information">
                            <div className="spinner-border" role="status"/>
                            <p className="mt-3"><AuthorsText tid="loading"/></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const loadMore = () => {
        api.get(`/authors?offset=${data.length}&limit=${AUTHORS_LIMIT}&sort_by=${lang === "ru" ? "name_ru" : "name_ar"}`)
            .then((response) => setData([...data, ...response.data.data]))
    };

    const truncateString = (text) => text?.length > 125 ? `${text.substring(0, 120)}...` : text;

    const getAuthorLifeDates = (birth: Date, death: Date) => {
        const options = {year: 'numeric'};
        const locale = languageContext.userLanguage === "ru" ? "ru-RU" : "ar-AE";

        const birth_date = new Date(birth);

        if (death !== undefined) {
            return <p>
                {birth_date.toLocaleDateString(locale, options)} ― {new Date(death).toLocaleDateString(locale, options)}
            </p>
        } else {
            const yearsOld = Math.abs(new Date(Date.now() - birth_date.getTime()).getUTCFullYear() - 1970)
            return <p>
                {birth_date.toLocaleDateString(locale, options)} ({yearsOld} {getDeclension(yearsOld)})
            </p>
        }
    };

    const getDeclension = (years: number) => {
        if (languageContext.userLanguage === "ar") return "سنة";

        const cases = [2, 0, 1, 1, 1, 2];
        const titles = ["год", "года", "лет"];

        return titles[(years % 100 > 4 && years % 100 < 20) ? 2 : cases[(years % 10 < 5) ? years % 10 : 5]];
    };

    const getAuthorCard = (author: Author) => {
        return (
            <div className="author-card col-md align-items-center" key={author.id}>
                <a className="author-link" href={"/authors/" + author.link}> </a>
                <div className="row">
                    <div className="col-md-4 m-auto my-3 text-center">
                        <img className="author-image" src={author.picture_path}
                             alt={lang === "ru" ? author.short_name_ru : author.short_name_ar}/>
                    </div>
                    <div className="col-md-7 m-auto">
                        <div className="author-body">
                            <div className="author-name">{lang === "ru" ? author.name_ru : author.name_ar}<br/>
                                <hr/>
                            </div>
                            <div className="author-life">
                                {getAuthorLifeDates(author.birth_date, author.death_date)}
                            </div>
                            <div className="author-biography">
                                {truncateString(lang === "ru" ? author.about_ru : author.about_ar)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    const createAuthor = async (data: Author) => {
        delete data["required"];

        const properties = Object.keys(data).filter(x => !["death_date", "picture"].includes(x));
        for (const property of properties) {
            data[property] = data[property].trim();
            if (data[property].length === 0) {
                setError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        if (!data["death_date"]) {
            delete data["death_date"]
        }

        if (data.picture.length === 0) {
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        data.picture = data.picture[0];
        try {
            await AuthorService.Create(data);
            NotifyService.Success(<AuthorsCreateForm tid="success_notify"/>)
            setRerender(!rerender);
        } catch {
            NotifyService.Error(<AuthorsCreateForm tid="error_notify"/>)
        }
    };

    return (
        <div className="album">
            <div className="container">
                {
                    AccountService.IsPrivilegedUser() && (
                        <>
                            <div className="col-md-8 m-auto pt-4">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-heading">
                                            <button className={"accordion-button article-form-header collapsed" +
                                                (lang === "ar" ? " accordion-button-ar" : "")} type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#flush-collapseAdd"
                                                    aria-expanded="false" aria-controls="flush-collapse">
                                                <AuthorsCreateForm tid="header"/>
                                            </button>
                                        </h2>
                                        <div id="flush-collapseAdd" className="accordion-collapse collapse"
                                             aria-labelledby="flush-heading">
                                            <div className="accordion-body pt-0">
                                                <form onSubmit={handleSubmit((data) => createAuthor(data))}
                                                      id="add-author-form" {...register("required")}>
                                                    {UpdateAuthorForm(register, errors)}
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
                {
                    data.length > 0 ? (
                        <div className="justify-content-center align-items-center row row-cols-md-2 g-3 m-3">
                            {data.map((author) => getAuthorCard(author))}
                        </div>
                    ) : (
                        <div className="information">
                            <i className="bi bi-folder-x information-icon"></i>
                            <p className="mt-3"><AuthorsText tid="no_data"/></p>
                        </div>
                    )
                }
                {
                    data.length < count &&
                    <div className="text-center m-3">
                        <button className="btn btn-outline-dark" onClick={loadMore}>
                            <AuthorsText tid="show_more"/>
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

export default AuthorsListPage;