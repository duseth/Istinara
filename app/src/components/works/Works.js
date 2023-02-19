import React, {useContext, useEffect, useState} from "react";
import {Work as WorkDTO} from "../../models/Work";
import {LanguageContext} from "../../languages/Language";
import api from "../../services/API";

import './Works.scss'
import {WorksText} from "../../containers/Language";
import {useParams} from "react-router-dom";

const works_per_page = 6;

const Works = () => {
    const languageContext = useContext(LanguageContext);
    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["works"] + " • Istinara";
    }, [languageContext]);

    const [count, setCount] = useState(0);
    const [data: Array<WorkDTO>, setData] = useState();

    useEffect(() => {
        api.get(`/works?offset=0&limit=${works_per_page}`)
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
                            <p className="mt-3"><WorksText tid="loading"/></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const loadMore = () => {
        api.get(`/works?offset=${data.length}&limit=${works_per_page}`)
            .then((response) => setData([...data, ...response.data.data]))
    };

    const getWorkCard = (work: WorkDTO) => {
        if (languageContext.userLanguage === "ru") {
            return (
                <div className="work-card col-md" key={work.id}>
                    <a className="work-card-link" href={"/works/" + work.link}/>
                    <img className="work-card-image" src={work.picture_path} alt={work.title_ru}/>
                    <div className="work-card-title left-20">{work.title_ru}</div>
                    <div className="work-card-about right-20">
                        {work.genre_ru} • {new Date(work.publication_date).getFullYear()}
                    </div>
                </div>
            )
        } else if (languageContext.userLanguage === "ar") {
            return (
                <div className="work-card col-md" key={work.id}>
                    <a className="work-card-link" href={"/works/" + work.link}/>
                    <img className="work-card-image" src={work.picture_path} alt={work.title_ar}/>
                    <div className="work-card-title">{work.title_ar}</div>
                    <div className="work-card-about">
                        {work.genre_ar} • {new Date(work.publication_date).getFullYear()}
                    </div>
                </div>

            )
        }
    };

    return (
        <div className="album">
            <div className="container">
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

const Work = () => {
    const {link} = useParams()
    return (
        <div>{link}</div>
    )
}

export {Work, Works};