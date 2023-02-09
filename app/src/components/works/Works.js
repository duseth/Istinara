import React, {useContext, useEffect, useState} from "react";
import Work from "../../models/Work";
import {LanguageContext} from "../../languages/Language";
import api from "../../services/API";

import './Works.scss'
import {WorksText} from "../../containers/Language";

const works_per_page = 5;

const Works = () => {
    const languageContext = useContext(LanguageContext);
    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["works"] + " • Istinara";
    }, [languageContext]);

    const [next, setNext] = useState(works_per_page);
    const [data: Array<Work>, setData] = useState()

    useEffect(() => {
        api.get("/works").then((response) => setData(response.data));
    }, []);

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
        setNext(next + works_per_page)
    }

    const getWorkCard = (work: Work) => {
        if (languageContext.userLanguage === "ru") {
            return (
                <div className="work-card" key={work.id}>
                </div>
            )
        } else if (languageContext.userLanguage === "ar") {
            return (
                <div className="work-card" key={work.id}>
                </div>
            )
        }
    };

    return (
        <div className="album">
            <div className="container">
                {
                    data.length > 0 ? (
                        <div className="row justify-content-center align-items-center m-3">
                            {data.slice(0, next).map((work) => getWorkCard(work))}
                        </div>
                    ) : (
                        <div className="information">
                            <i className="bi bi-folder-x information-icon"></i>
                            <p className="mt-3"><WorksText tid="no_data"/></p>
                        </div>
                    )
                }
                {
                    next < data?.length &&
                    <div className="text-center">
                        <button className="btn btn-outline-dark" onClick={loadMore}>
                            <WorksText tid="show_more"/>
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}

export default Works