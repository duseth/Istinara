import React, {useContext, useEffect} from "react";

import './styles.scss'
import {TeamArtist, TeamAuthor, TeamDeveloper, TeamSupervisor, TeamText} from "../../containers/Language";
import {LanguageContext} from "../../../bin/context/Language";

const TeamPage = () => {
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["team"] + " • Istinara"
    }, [languageContext]);

    return (
        <div className="container text-center py-5">
            <div className="row d-flex justify-content-center align-items-center m-1">
                <h1 className="team-header"><TeamText tid="header"/></h1>
                <div className="main-content">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item bg-transparent p-4">
                            <i className="bi bi-lightbulb team-position-icon"/>
                            <div>
                                <span className="badge bg-dark text-wrap team-position">
                                    <TeamSupervisor tid="position"/>
                                </span>
                            </div>
                            <p className="team-full-name"><TeamSupervisor tid="full_name"/></p>
                            <p className="team-status"><TeamSupervisor tid="status"/></p>
                        </li>
                        <li className="list-group-item bg-transparent p-4">
                            <i className="bi bi-journal-text team-position-icon"/>
                            <div>
                                <span className="badge bg-dark text-wrap team-position">
                                    <TeamAuthor tid="position"/>
                                </span>
                            </div>
                            <p className="team-full-name"><TeamAuthor tid="full_name"/></p>
                            <p className="team-status"><TeamAuthor tid="status"/></p>
                        </li>
                        <li className="list-group-item bg-transparent p-4">
                            <i className="bi bi-image-fill team-position-icon"/>
                            <div>
                                <span className="badge bg-dark text-wrap team-position">
                                    <TeamArtist tid="position"/>
                                </span>
                            </div>
                            <p className="team-full-name"><TeamArtist tid="full_name"/></p>
                            <p className="team-status"><TeamArtist tid="status"/></p>
                        </li>
                        <li className="list-group-item bg-transparent p-4">
                            <i className="bi bi-braces team-position-icon"/>
                            <div>
                                <span className="badge bg-dark text-wrap team-position">
                                    <TeamDeveloper tid="position"/>
                                </span>
                            </div>
                            <p className="team-full-name"><TeamDeveloper tid="full_name"/></p>
                            <p className="team-status"><TeamDeveloper tid="status"/></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TeamPage;