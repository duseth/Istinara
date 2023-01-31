import React, {useContext, useEffect, useRef, useState} from 'react';

import './Contribution.scss'
import {LanguageContext} from "../../languages/Language";
import {ContributionForm, ContributionText} from "../../containers/Language";
import Author from "../../models/Author";
import api from "../../services/API";
import Work from "../../models/Work";

const Contribution = () => {
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["contribution"] + " • Istinara";
    }, [languageContext]);

    const [authors: Array<Author>, setAuthors] = useState()

    useEffect(() => {
        api.get("/authors").then((response) => setAuthors(response.data));
    }, []);

    const [works: Array<Work>, setWorks] = useState()
    const worksInput = useRef(null)

    const unlockWorks = (author) => {
        const uuid = author.target.value;
        api.get(`/authors/${uuid}/works`).then((response) => setWorks(response.data));
        worksInput.current.disabled = false;
    };

    const submitForm = (form) => {
        console.log(form);
    }

    let lang = languageContext.userLanguage;

    return (
        <section className="contribution-container">
            <div className="container py-5 bg-light">
                <div className="row justify-content-center align-items-center">
                    <div className="contribution-header">
                        <i className="bi bi-send-plus contribution-icon"></i>
                        <p><ContributionText tid="header"/></p>
                    </div>
                    <form className="contribution-form row g-3" onSubmit={submitForm}>
                        <p className="contribution-form-header"><ContributionForm tid="header"/></p>
                        <div className="col-12">
                            <select className="form-select" id={"author_" + lang} defaultValue="null" name="author_id"
                                    onChange={unlockWorks}>
                                <option value="null" disabled><ContributionForm tid="choose-author"/></option>
                                {
                                    authors?.map((author) =>
                                        <option key={author.id} value={author.id}>
                                            {lang === "ru" ? author.name_ru : author.name_ar}
                                        </option>
                                    )
                                }
                            </select>
                        </div>
                        <div className="col-12">
                            <select className="form-select" id={"work_" + lang} defaultValue="null"
                                    disabled ref={worksInput}>
                                <option value="null" disabled>
                                    <ContributionForm tid="choose-work"/>
                                </option>
                                {
                                    works?.map((work) =>
                                        <option key={work.id} value={work.id}>
                                            {lang === "ru" ? work.title_ru : work.title_ar}
                                        </option>
                                    )
                                }
                            </select>
                        </div>
                        <div className="col-12">
                            <label htmlFor={"title_" + lang} className="form-label">
                                <ContributionForm tid="title"/>
                            </label>
                            <input type="text" className="form-control" id={"title_" + lang}/>
                        </div>
                        <div className="col-12">
                            <label htmlFor={"quote_" + lang} className="form-label">
                                <ContributionForm tid="quote"/>
                            </label>
                            <input type="text" className="form-control" id={"quote_" + lang}/>
                        </div>
                        <div className="col-12">
                            <label htmlFor={"description_" + lang} className="form-label">
                                <ContributionForm tid="description"/>
                            </label>
                            <textarea rows="5" className="form-control" id={"description_" + lang}/>
                        </div>
                        <hr/>
                        <div className="col-md-6">
                            <label htmlFor="name" className="form-label"><ContributionForm tid="name"/></label>
                            <input type="text" className="form-control" id="name"/>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email"/>
                        </div>
                        <div className="col-12 row justify-content-center align-items-center mt-4 m-auto">
                            <button type="submit" className="btn btn-outline-dark w-25">
                                <ContributionForm tid="button_text"/>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contribution;