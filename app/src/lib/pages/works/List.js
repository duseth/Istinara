import React, {useContext, useEffect, useState} from "react";

import './styles.scss'
import api from "../../../config/API";
import {Author} from "../../models/Author";
import {LanguageContext} from "../../../bin/context/Language";
import {Work} from "../../models/Work";
import AccountService from "../../services/AccountService";
import {GeneralForm, WorksCreateForm, WorksText} from "../../containers/Language";
import NotifyService from "../../services/NotifyService";
import {useForm} from "react-hook-form";
import WorkService from "../../services/WorkService";
import UpdateWorkForm from "../../components/works/UpdateWorkForm";

const WORKS_LIMIT = 6;

const WorksListPage = () => {
    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const [rerender, setRerender] = useState(false);
    const [count, setCount] = useState(0);
    const [data: Array<Work>, setData] = useState();
    const [authors: Array<Author>, setAuthors] = useState(null);

    const {register, setError, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["works"] + " • Istinara";
    }, [languageContext]);

    useEffect(() => {
        if (AccountService.IsPrivilegedUser()) {
            api.get("/authors/signatures").then((response) => setAuthors(response.data));
        }
    }, []);

    useEffect(() => {
        api.get(`/works?offset=0&limit=${WORKS_LIMIT}&sort_by=${lang === "ru" ? "title_ru" : "title_ar"}`)
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
                            <p className="mt-3"><WorksText tid="loading"/></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const loadMore = () => {
        api.get(`/works?offset=${data.length}&limit=${WORKS_LIMIT}&sort_by=${lang === "ru" ? "title_ru" : "title_ar"}`)
            .then((response) => setData([...data, ...response.data.data]))
    };

    const getWorkCard = (work: Work) => {
        return (
            <div className="work-card col-md" key={work.id}>
                <a className="work-card-link" href={"/works/" + work.link}> </a>
                <img className="work-card-image" src={work.picture_path}
                     alt={lang === "ru" ? work.title_ru : work.title_ar}/>
                <div className="work-card-title left-20">{lang === "ru" ? work.title_ru : work.title_ar}</div>
                <div className="work-card-about right-20">
                    {lang === "ru" ? work.genre_ru : work.genre_ar} • {new Date(work.publication_date).getFullYear()}
                </div>
            </div>
        )
    };

    const createWork = async (data: Author) => {
        delete data["required"];

        const properties = Object.keys(data).filter(x => x !== "picture");
        for (const property of properties) {
            data[property] = data[property].trim();
            if (data[property].length === 0) {
                setError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        if (data.picture.length === 0) {
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        data.picture = data.picture[0];
        try {
            await WorkService.Create(data);
            NotifyService.Success(<WorksCreateForm tid="success_notify"/>)
            setRerender(!rerender);
        } catch {
            NotifyService.Error(<WorksCreateForm tid="error_notify"/>)
        }
    };

    return (
        <div className="album">
            <div className="container">
                {
                    AccountService.IsPrivilegedUser() && authors?.length > 0 && (
                        <>
                            <div className="col-md-8 m-auto pt-4">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-heading">
                                            <button className={"accordion-button article-form-header collapsed" +
                                                (lang === "ar" ? " accordion-button-ar" : "")} type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#flush-collapseAdd"
                                                    aria-expanded="false" aria-controls="flush-collapse">
                                                <WorksCreateForm tid="header"/>
                                            </button>
                                        </h2>
                                        <div id="flush-collapseAdd" className="accordion-collapse collapse"
                                             aria-labelledby="flush-heading">
                                            <div className="accordion-body pt-0">
                                                <form onSubmit={handleSubmit((data) => createWork(data))}
                                                      id="add-work-form" {...register("required")}>
                                                    {UpdateWorkForm(register, errors, authors?.map(author => {
                                                        return {
                                                            id: author.id,
                                                            name: lang === "ru" ? author.name_ru : author.name_ar
                                                        };
                                                    }))}
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
                            {data.map((work) => getWorkCard(work))}
                        </div>
                    ) : (
                        <div className="information">
                            <i className="bi bi-folder-x information-icon"></i>
                            <p className="mt-3"><WorksText tid="no_data"/></p>
                        </div>
                    )
                }
                {
                    data.length < count &&
                    <div className="text-center m-3">
                        <button className="btn btn-outline-dark" onClick={loadMore}>
                            <WorksText tid="show_more"/>
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

export default WorksListPage;