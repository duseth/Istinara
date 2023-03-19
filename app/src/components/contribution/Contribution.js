import {useForm} from "react-hook-form";
import React, {useContext, useEffect, useState} from 'react';

import './Contribution.scss'
import API from "../../services/API";
import {Work} from "../../models/Work";
import {User} from "../../models/User";
import {Contribution} from "../../models/Contribution";
import {Group} from "../../models/Group";
import {LanguageContext} from "../../languages/Language";
import NotifyService from "../../services/NotifyService";
import AccountService from "../../services/AccountService";
import {ArticlesForm, ContributionForm, ContributionText, GeneralForm} from "../../containers/Language";

const ContributionPage = () => {
    const languageContext = useContext(LanguageContext);

    const lang = languageContext.userLanguage;
    const user: User = AccountService.GetCurrentUser();

    const [works: Array<Work>, setWorks] = useState();
    const [groups: Array<Group>, setGroups] = useState();

    const {register, reset, setError, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["contribution"] + " • Istinara";
    }, [languageContext]);

    useEffect(() => {
        API.get("/works").then((response) => setWorks(response.data?.data));
    }, []);

    useEffect(() => {
        API.get("/groups").then((response) => setGroups(response.data?.data));
    }, []);

    const sendRequest = async (data: Contribution) => {
        delete data["required"];

        const excludeProperties = ["group_id", "work_id", "transcription", "picture"];
        const properties = Object.keys(data).filter(x => !excludeProperties.includes(x));

        if (data.group_id === undefined || data.group_id === "null") {
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
        formData.append("group_id", data.group_id);
        formData.append("work_id", data.work_id);

        if (data.picture.length !== 0) {
            data.picture = data.picture[0];
        } else {
            delete data["picture"];
        }

        if (data.transcription.length === 0) {
            delete data["transcription"];
        }

        properties.map((field) => {
            formData.append(field, data[field])
        });

        let formDataHeaders = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        await API.post("/contribution", formData, formDataHeaders)
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
                                    <select className="form-select" id="group_id" defaultValue={"null"}
                                            name="group_id" {...register("group_id")}>
                                        <option value="null" disabled><ArticlesForm tid="choose_group"/></option>
                                        {
                                            groups?.map((group) =>
                                                <option key={group.id} value={group.id}>
                                                    {lang === "ru" ? group.name_ru : group.name_ar}
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
                                        <option value="null" disabled><ArticlesForm tid="choose_work"/></option>
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
                                    <label htmlFor="title_ru" className="form-label"><ArticlesForm
                                        tid="russian"/></label>
                                    <input type="text" dir="ltr" className="form-control" id="title_ru"
                                           {...register("title_ru")}/>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="title_ar" className="form-label"><ArticlesForm
                                        tid="arabic"/></label>
                                    <input type="text" dir="rtl" className="form-control" id="title_ar"
                                           {...register("title_ar")}/>
                                </div>
                            </div>
                        </div>
                        <div className="pt-3">
                            <p className="m-0"><ArticlesForm tid="quote"/></p>
                            <div className="row">
                                <div className="col-12">
                                    <label htmlFor="quote_ru" className="form-label"><ArticlesForm
                                        tid="russian"/></label>
                                    <textarea rows="4" dir="ltr" className="form-control" id="quote_ru"
                                              {...register("quote_ru")}/>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="quote_ar" className="form-label"><ArticlesForm
                                        tid="arabic"/></label>
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
                                        <ArticlesForm tid="russian"/>
                                    </label>
                                    <textarea rows="4" dir="ltr" className="form-control" id="description_ru"
                                              {...register("description_ru")}/>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="description_ar" className="form-label">
                                        <ArticlesForm tid="arabic"/>
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
                            <p className="mb-2"><ArticlesForm tid="picture"/></p>
                            <div className="row">
                                <div className="col-12">
                                    <input type="file" className="form-control" id="picture" {...register("picture")}/>
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