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
        return <div>Loading...</div>;
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
                <div className="row justify-content-center align-items-center m-3">
                    {
                        data.length > 0 ? (
                            data.slice(0, next).map((work) => getWorkCard(work))
                        ) : (
                            <div className="no-data">
                                <i className="bi bi-folder-x no-data-icon"></i>
                                <p className="no-data-message"><WorksText tid="no_data"/></p>
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
        </div>
    );
}

export default Works