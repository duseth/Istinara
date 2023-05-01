import {useForm} from "react-hook-form";
import React, {useContext, useEffect, useState} from 'react';

import "./styles.scss"

import api from "../../../config/API";
import {Work} from "../../models/Work";
import User from "../../models/User";
import Contribution from "../../models/Contribution";
import ArticleType from "../../models/ArticleType";
import {LanguageContext} from "../../../bin/context/Language";
import NotifyService from "../../services/NotifyService";
import AccountService from "../../services/AccountService";
import {ArticlesForm, ContributionForm, ContributionText, GeneralForm} from "../../containers/Language";

const ContributionPage = () => {
    const languageContext = useContext(LanguageContext);

    const lang = languageContext.userLanguage;
    const user: User = AccountService.GetCurrentUser();

    const [works: Array<Work>, setWorks] = useState();
    const [articleTypes: Array<ArticleType>, setArticleTypes] = useState();

    const {register, reset, setError, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["contribution"] + " • Istinara";
    }, [languageContext]);

    useEffect(() => {
        api.get("/works/signatures").then((response) => setWorks(response.data));
    }, []);

    useEffect(() => {
        api.get("/articles/types").then((response) => setArticleTypes(response.data));
    }, []);

    const sendRequest = async (data: Contribution) => {
        delete data["required"];

        const excludeProperties = ["article_type_id", "work_id", "transcription"];
        const properties = Object.keys(data).filter(x => !excludeProperties.includes(x));

        if (data.article_type_id === undefined || data.article_type_id === "null") {
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        if (data.work_id === undefined || data.work_id === "null") {
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        for (const property of properties) {
            if (data[property].trim().length === 0) {
                setError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        const emailValidation = new RegExp(".+@.+\\.[A-Za-z]+$");
        if (!emailValidation.test(data.email)) {
            setError("email", {message: <GeneralForm tid="error_email"/>});
            return;
        }

        let formData = new FormData();
        formData.append("article_type_id", data.article_type_id);
        formData.append("work_id", data.work_id);

        properties.forEach((field) => {
            formData.append(field, data[field])
        });

        data["transcription"] = data["transcription"]?.trim()
        if (data["transcription"]?.length > 0) {
            formData.append("transcription", data["transcription"])
        }

        await api.post("/articles/contributions", formData)
            .then(() => {
                NotifyService.Success(<ContributionForm tid="success_notify"/>);
                reset();
            })
            .catch(() => NotifyService.Error(<ContributionForm tid="error_notify"/>))
    };

    return (
        <section className="main-container">
            <div className="container py-5">
                <div className="row justify-content-center align-items-center m-1">
                    <div className="contribution-header">
                        <i className="bi bi-folder-plus contribution-icon"/>
                        <p><ContributionText tid="header"/></p>
                    </div>
                    <form onSubmit={handleSubmit((data) => sendRequest(data))}
                          className="contribution-form row" id="request-form" {...register("required")}>
                        <p className="contribution-form-header"><ContributionForm tid="header"/></p>
                        <div className="pt-3">
                            <div className="row">
                                <div className="col-12">
                                    <select className="form-select" id="article_type_id" defaultValue={"null"}
                                            name="article_type_id" {...register("article_type_id")}>
                                        <option value="null" disabled><GeneralForm tid="choose_article_type"/></option>
                                        {
                                            articleTypes?.map((articleType) =>
                                                <option key={articleType.id} value={articleType.id}>
                                                    {lang === "ru" ? articleType.name_ru : articleType.name_ar}
                                                </option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="pt-3">
                            <div className="row">
                                <div className="col-12">
                                    <select className="form-select" id="work_id" defaultValue={"null"}
                                            name="work_id" {...register("work_id")}>
                                        <option value="null" disabled><GeneralForm tid="choose_work"/></option>
                                        {
                                            works?.map((work) =>
                                                <option key={work.id} value={work.id}>
                                                    {lang === "ru" ? work.title_ru : work.title_ar}
                                                </option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="pt-3">
                            <p className="m-0"><ArticlesForm tid="title"/></p>
                            <div className="row">
                                <div className="col-6">
                                    <label htmlFor="title_ru" className="form-label">
                                        <GeneralForm tid="russian"/>
                                    </label>
                                    <input type="text" dir="ltr" className="form-control" id="title_ru"
                                           {...register("title_ru")}/>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="title_ar" className="form-label">
                                        <GeneralForm tid="arabic"/>
                                    </label>
                                    <input type="text" dir="rtl" className="form-control" id="title_ar"
                                           {...register("title_ar")}/>
                                </div>
                            </div>
                        </div>
                        <div className="pt-3">
                            <p className="m-0"><ArticlesForm tid="quote"/></p>
                            <div className="row">
                                <div className="col-12">
                                    <label htmlFor="quote_ru" className="form-label">
                                        <GeneralForm tid="russian"/>
                                    </label>
                                    <textarea rows="4" dir="ltr" className="form-control" id="quote_ru"
                                              {...register("quote_ru")}/>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="quote_ar" className="form-label">
                                        <GeneralForm tid="arabic"/>
                                    </label>
                                    <textarea rows="4" dir="rtl" className="form-control" id="quote_ar"
                                              {...register("quote_ar")}/>
                                </div>
                            </div>
                        </div>
                        <div className="pt-3">
                            <p className="m-0"><ArticlesForm tid="description"/></p>
                            <div className="row">
                                <div className="col-12">
                                    <label htmlFor="description_ru" className="form-label">
                                        <GeneralForm tid="russian"/>
                                    </label>
                                    <textarea rows="4" dir="ltr" className="form-control" id="description_ru"
                                              {...register("description_ru")}/>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="description_ar" className="form-label">
                                        <GeneralForm tid="arabic"/>
                                    </label>
                                    <textarea rows="4" dir="rtl" className="form-control" id="description_ar"
                                              {...register("description_ar")}/>
                                </div>
                            </div>
                        </div>
                        <div className="pt-3">
                            <p className="mb-2"><ArticlesForm tid="transcription"/></p>
                            <div className="row">
                                <div className="col-12">
                                    <input type="text" dir="ltr" className="form-control" id="transcription"
                                           {...register("transcription")}/>
                                </div>
                            </div>
                        </div>
                        <div className="pt-3">
                            <hr/>
                            <p className="m-0"><ContributionForm tid="name"/></p>
                            <div className="row">
                                <div className="col-6">
                                    <label htmlFor="name" className="form-label"><ContributionForm tid="name"/></label>
                                    <input type="text" className="form-control" id="name"
                                           defaultValue={user?.username} {...register("name")}/>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="text" className="form-control" id="email"
                                           defaultValue={user?.email} {...register("email")}/>
                                </div>
                            </div>
                        </div>
                        <div className="form-error mt-4 mb-0">
                            {errors?.required?.message || errors?.email?.message}
                        </div>
                        <div className="col-12 row justify-content-center align-items-center mt-3 m-auto">
                            <button type="submit" className="btn btn-outline-dark w-auto">
                                <ContributionForm tid="button_text"/>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContributionPage;