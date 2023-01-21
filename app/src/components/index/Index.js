import React, {useContext, useEffect} from 'react';

import './Index.scss'
import {LanguageContext} from "../../languages/Language";

const Home = () => {
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        document.title = "Istinara";
    }, [languageContext]);

    return (
        <main>
            <section className="py-5 text-center container">
                <div className="row py-lg-5">
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <h1 className="fw-light">Album example</h1>
                        <p className="lead text-muted">Something short and leading about the collection below—its
                            contents, the creator, etc. Make it short and sweet, but not too short so folks don’t simply
                            skip over it entirely.</p>
                    </div>
                </div>
            </section>
            <div className="album py-5 bg-light">
                <div className="container">
                    <div className="row row-cols-1 rows-cols-sm-2 row-cols-md-3 g-3">

                        <div className="col">
                            <div className="card">
                                <a className="card-link" href="#"/>
                                <div className="card-image"
                                     style={{backgroundImage: "url(https://cdn-s-static.arzamas.academy/storage/course/333/rectangular_preview_detail_picture-d9909237-1eb6-4353-af82-0fc53b421f20.jpg)"}}></div>
                                <div className="card-text">
                                    This is a wider card with supporting text below as a natural lead-in to additional
                                    content. This content is a little bit longer.
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="card">
                                <a className="card-link" href="#"/>
                                <div className="card-image"
                                     style={{backgroundImage: "url(https://cdn-s-static.arzamas.academy/storage/course/333/rectangular_preview_detail_picture-d9909237-1eb6-4353-af82-0fc53b421f20.jpg)"}}></div>
                                <div className="card-text">
                                    This is a wider card with supporting text below as a natural lead-in to additional
                                    content. This content is a little bit longer.
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="card">
                                <a className="card-link" href="#"/>
                                <div className="card-image"
                                     style={{backgroundImage: "url(https://cdn-s-static.arzamas.academy/storage/course/333/rectangular_preview_detail_picture-d9909237-1eb6-4353-af82-0fc53b421f20.jpg)"}}></div>
                                <div className="card-text">
                                    This is a wider card with supporting text below as a natural lead-in to additional
                                    content. This content is a little bit longer.
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="card">
                                <a className="card-link" href="#"/>
                                <div className="card-image"
                                     style={{backgroundImage: "url(https://cdn-s-static.arzamas.academy/storage/course/333/rectangular_preview_detail_picture-d9909237-1eb6-4353-af82-0fc53b421f20.jpg)"}}></div>
                                <div className="card-text">
                                    This is a wider card with supporting text below as a natural lead-in to additional
                                    content. This content is a little bit longer.
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;