import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";

import './Authors.scss'
import API from "../../services/API";
import {Work as WorkDTO} from "../../models/Work";
import {Author, AuthorCard} from "../../models/Author";
import {LanguageContext} from "../../languages/Language";
import AccountService from "../../services/AccountService";
import {
    AuthorsCreateForm,
    AuthorsDeleteForm,
    AuthorsForm,
    AuthorsPage,
    AuthorsText,
    AuthorsUpdateForm,
    GeneralForm
} from "../../containers/Language";
import AuthorService from "../../services/AuthorService";
import NotifyService from "../../services/NotifyService";

const AUTHORS_LIMIT = 6;

const AuthorsListPage = () => {
    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const [count, setCount] = useState(0);
    const [data: Array<Author>, setData] = useState()

    const {register, reset, setError, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["authors"] + " • Istinara";
    }, [languageContext]);

    useEffect(() => {
        API.get(`/authors?offset=0&limit=${AUTHORS_LIMIT}`)
            .then((response) => {
                setCount(response.data.count);
                setData(response.data.data);
            })
            .catch(() => {
                setData([]);
            });
    }, []);

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
        API.get(`/authors?offset=${data.length}&limit=${AUTHORS_LIMIT}`)
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
                <a className="author-link" href={"/authors/" + author.link}/>
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

    const getAuthorFormAccordionButton = () => {
        return languageContext.userLanguage === "ru"
            ? "accordion-button article-form-header collapsed"
            : "accordion-button article-form-header accordion-button-ar collapsed";
    };

    const createAuthor = async (data: Author) => {
        delete data["required"];

        const fields = Object.keys(data).filter(x => !["death_date", "picture"].includes(x));
        for (const field of fields) {
            if (data[field].trim().length === 0) {
                setError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        if (!data["death_date"]) {
            delete data["death_date"]
        }

        data.picture = data.picture[0];
        try {
            await AuthorService.Create(data);
            NotifyService.Success(<AuthorsCreateForm tid="success_notify"/>)
            reset();
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
                                            <button className={getAuthorFormAccordionButton()} type="button"
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
                                                    {GetAuthorForm(register, errors)}
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
                        <div className="justify-content-center align-items-center row row-cols-md-3 g-3 m-3">
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

const AuthorPage = () => {
    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const {link} = useParams()

    const [author: Author, setAuthor] = useState();
    const [works: Array<WorkDTO>, setWorks] = useState();

    const [prevAuthor: Author, setPrevAuthor] = useState();
    const [nextAuthor: Author, setNextAuthor] = useState();
    const [authorCard: AuthorCard, setAuthorCard] = useState();

    const {register, setError, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        API.get("/authors/" + link)
            .then((response) => setAuthor(response.data))
            .catch(() => setAuthor(null));
    }, []);

    useEffect(() => {
        if (author) {
            const title = languageContext.userLanguage === "ru" ? author.short_name_ru : author.short_name_ar;
            document.title = title + " • Istinara";
        }
    }, [author, languageContext]);

    useEffect(() => {
        if (author) {
            API.get(`/authors/${author.id}/works`).then((response) => setWorks(response.data));
        }
    }, [author]);

    useEffect(() => {
        if (author) {
            API.get("/authors").then((response) => {
                const authors: Array<Author> = response.data?.data;
                authors?.map((item, index) => {
                    if (item.id === author.id) {
                        setPrevAuthor(authors[((index - 1) + authors.length) % authors.length]);
                        setNextAuthor(authors[(index + 1) % authors.length]);
                    }
                });
            });
        }
    }, [author]);

    useEffect(() => {
        if (author) {
            setAuthorCard({
                name: lang === "ru" ? author.name_ru : author.name_ar,
                short_name: lang === "ru" ? author.short_name_ru : author.short_name_ar,
                about: lang === "ru" ? author.about_ru : author.about_ar,
            });
        }
    }, [author, languageContext]);

    if (author === null) {
        return (
            <div className="information">
                <i className="bi bi-folder-x information-icon"></i>
                <p className="mt-3"><AuthorsPage tid="no_data"/></p>
            </div>
        )
    }

    if (!author || !authorCard || !works || !prevAuthor || !nextAuthor) {
        return (
            <div className="album">
                <div className="container py-5">
                    <div className="row justify-content-center align-items-center m-3">
                        <div className="information">
                            <div className="spinner-border" role="status"/>
                            <p className="mt-3"><AuthorsPage tid="loading"/></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getDate = (date: Date) => {
        const locale = lang === "ru" ? "ru-RU" : "ar-AE";
        return new Date(date).toLocaleDateString(locale, {day: "numeric", month: "long", year: 'numeric'})
    };

    const getWorkCard = (work: WorkDTO, is_active: boolean) => {
        return (
            <div className={is_active ? "carousel-item active" : "carousel-item"} key={work.id}>
                <div className="author-work-card m-auto">
                    <a className="work-card-link" href={"/works/" + work.link}/>
                    <img className="work-card-image" src={work.picture_path}
                         alt={lang === "ru" ? work.title_ru : work.title_ar}/>
                    <div className="author-work-card-title left-20">
                        {lang === "ru" ? work.title_ru : work.title_ar}
                    </div>
                    <div className="author-work-card-about right-20">
                        {lang === "ru" ? work.genre_ru : work.genre_ar} • {new Date(work.publication_date).getFullYear()}
                    </div>
                </div>
            </div>
        )
    };

    const getAuthorFormAccordionButton = () => {
        return lang === "ru"
            ? "accordion-button article-form-header collapsed"
            : "accordion-button article-form-header accordion-button-ar collapsed";
    };

    const updateAuthor = async (data: Author) => {
        delete data["required"];
        const properties = Object.keys(data).filter(x => !["birth_date", "death_date", "picture"].includes(x));

        for (const property of properties) {
            if (data[property].trim().length === 0) {
                setError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        for (const property of properties) {
            if (data[property] === author[property]) {
                delete data[property];
            }
        }

        for (const date of ["birth_date", "death_date"]) {
            if (data[date] === author[date].slice(0, 10)) {
                delete data[date];
            }
        }

        if (data["picture"].length === 0) {
            delete data["picture"];
        } else {
            data.picture = data.picture[0];
        }

        if (Object.keys(data).length === 0) {
            setError("required", {message: <GeneralForm tid="error_no_changes"/>});
            return;
        }

        try {
            const link = await AuthorService.Update(author.id, data);
            NotifyService.Success(<AuthorsUpdateForm tid="success_notify"/>)
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + link;
        } catch {
            NotifyService.Error(<AuthorsUpdateForm tid="error_notify"/>)
        }
    };

    const deleteAuthor = async () => {
        try {
            await AuthorService.Delete(author.id);
            NotifyService.Success(<AuthorsDeleteForm tid="success_notify"/>)
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
        } catch {
            NotifyService.Error(<AuthorsDeleteForm tid="error_notify"/>)
        }
    };

    return (
        <section className="main-container">
            <div className="container py-5 px-3">
                <div className="row">
                    <div className="text-center col-md-4">
                        <img className="author-page-image m-2 me-3" src={author.picture_path}
                             alt={authorCard.name}/>
                        <h6 className="mt-0">{authorCard.short_name}</h6>
                        <div className="mt-3 mb-3">
                            <p className="author-date m-1">
                                <b><AuthorsPage tid="birth_date"/>:</b> {getDate(author.birth_date)}
                            </p>
                            {
                                author.death_date && (
                                    <p className="author-date m-1">
                                        <b><AuthorsPage tid="death_date"/>:</b> {getDate(author.death_date)}
                                    </p>
                                )
                            }
                        </div>
                    </div>
                    <div className="col-md-8">
                        <h4>{authorCard.name}</h4>
                        <div className="author-page-about">
                            {authorCard.about}
                        </div>
                        {
                            works?.length > 0 && (
                                <div className="text-center my-3">
                                    <hr/>
                                    <h5 className="mb-3"><AuthorsPage tid="works_title"/></h5>
                                    <div id="carouselExampleControls" className="carousel carousel-dark slide"
                                         data-bs-ride="carousel">
                                        <div className="carousel-inner rounded-3">
                                            {
                                                works.map((work, index) => getWorkCard(work, index === 0))
                                            }
                                        </div>
                                        <button className="carousel-control-prev" type="button"
                                                data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon text-dark" aria-hidden="true"/>
                                        </button>
                                        <button className="carousel-control-next" type="button"
                                                data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"/>
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                {
                    (prevAuthor || nextAuthor) && (
                        <div className="row">
                            <hr/>
                            <div className="col-md-6 d-flex flex-row">
                                <div className="jump-author-card">
                                    <a className="author-link" href={prevAuthor.link}/>
                                    <i className={languageContext.userLanguage === "ru"
                                        ? "bi bi-arrow-left jump-author-icon"
                                        : "bi bi-arrow-right jump-author-icon"}></i>
                                    <div className="jump-author-name col">
                                        {lang === "ru" ? prevAuthor.short_name_ru : prevAuthor.short_name_ar}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex flex-row-reverse">
                                <div className="jump-author-card">
                                    <a className="author-link" href={nextAuthor.link}/>
                                    <div className="jump-author-name col">
                                        {lang === "ru" ? nextAuthor.short_name_ru : nextAuthor.short_name_ar}
                                    </div>
                                    <i className={lang === "ru" ? "bi bi-arrow-right jump-author-icon" : "bi bi-arrow-left jump-author-icon"}/>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    AccountService.IsPrivilegedUser() && (
                        <div className="row">
                            <div className="col-md-9 m-auto pt-4">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-heading">
                                            <button className={getAuthorFormAccordionButton()} type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#flush-collapse"
                                                    aria-expanded="false" aria-controls="flush-collapse">
                                                <AuthorsUpdateForm tid="header"/>
                                            </button>
                                        </h2>
                                        <div id="flush-collapse" className="accordion-collapse collapse"
                                             aria-labelledby="flush-heading">
                                            <div className="accordion-body pt-0">
                                                <form onSubmit={handleSubmit((data, event) => updateAuthor(data, event))}
                                                      id="add-author-form" {...register("required")}>
                                                    {GetAuthorForm(register, errors, author)}
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 pt-4 my-2">
                                <button type="button" className="btn btn-outline-danger"
                                        onClick={() => {
                                            NotifyService.Confirm(
                                                <AuthorsDeleteForm tid="confirm"/>,
                                                <AuthorsDeleteForm tid="accept"/>,
                                                <AuthorsDeleteForm tid="dismiss"/>,
                                                deleteAuthor
                                            );
                                        }}>
                                    <AuthorsDeleteForm tid="button_text"/>
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
        </section>
    )
};

const GetAuthorForm = (register, errors, author) => {
    return (
        <>
            <div className="pt-3">
                <p className="m-0"><AuthorsForm tid="name"/></p>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor="name_ru" className="form-label">
                            <AuthorsForm tid="russian"/>
                        </label>
                        <input type="text" dir="ltr" className="form-control"
                               id="name_ru" {...register("name_ru")} defaultValue={author?.name_ru}/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="name_ar" className="form-label">
                            <AuthorsForm tid="arabic"/>
                        </label>
                        <input type="text" dir="rtl" className="form-control"
                               id="name_ar" {...register("name_ar")} defaultValue={author?.name_ar}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <p className="m-0"><AuthorsForm tid="short_name"/></p>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor="short_name_ru" className="form-label">
                            <AuthorsForm tid="russian"/>
                        </label>
                        <input type="text" dir="ltr" className="form-control"
                               id="short_name_ru" {...register("short_name_ru")} defaultValue={author?.short_name_ru}/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="short_name_ar" className="form-label">
                            <AuthorsForm tid="arabic"/>
                        </label>
                        <input type="text" dir="rtl" className="form-control"
                               id="short_name_ar" {...register("short_name_ar")} defaultValue={author?.short_name_ar}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <p className="m-0"><AuthorsForm tid="about"/></p>
                <div className="row">
                    <div className="col-12">
                        <label htmlFor="about_ru" className="form-label">
                            <AuthorsForm tid="russian"/>
                        </label>
                        <textarea rows="4" dir="ltr" className="form-control"
                                  id="about_ru" {...register("about_ru")} defaultValue={author?.about_ru}/>
                    </div>
                    <div className="col-12">
                        <label htmlFor="about_ar" className="form-label">
                            <AuthorsForm tid="arabic"/>
                        </label>
                        <textarea rows="4" dir="rtl" className="form-control"
                                  id="about_ar" {...register("about_ar")} defaultValue={author?.about_ar}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <div className="row">
                    <div className="col-6">
                        <label htmlFor="birth_date" className="form-label">
                            <AuthorsForm tid="birth_date"/>
                        </label>
                        <input type="date" className="date form-control"
                               id="birth_date" {...register("birth_date")}
                               defaultValue={author && author.birth_date && author.birth_date.slice(0, 10)}/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="death_date" className="date form-label">
                            <AuthorsForm tid="death_date"/>
                        </label>
                        <input type="date" className="form-control"
                               id="death_date" {...register("death_date")}
                               defaultValue={author && author.death_date && author.death_date.slice(0, 10)}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <div className="row">
                    <div className="col-12">
                        <label htmlFor="picture" className="form-label">
                            <AuthorsForm tid="picture"/>
                        </label>
                        <input type="file" className="form-control" id="picture"
                               {...register("picture")}/>
                    </div>
                </div>
            </div>
            <div className="form-error mt-4 mb-0">
                {errors?.required?.message || errors?.email?.message}
            </div>
            <div
                className="col-12 row justify-content-center align-items-center mt-4 m-auto">
                <button type="submit" className="btn btn-outline-dark w-auto">
                    {
                        !author
                            ? <AuthorsCreateForm tid="button_text"/>
                            : <AuthorsUpdateForm tid="button_text"/>
                    }
                </button>
            </div>
        </>
    )
};

export {AuthorPage, AuthorsListPage}