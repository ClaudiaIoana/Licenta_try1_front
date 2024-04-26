import React, { useState, useEffect, useRef } from "react";
import {Link, useNavigate} from "react-router-dom";
import {Note} from "../../models/Note";
import {Flashcard} from "../../models/Flashcard";
import AllFlashCards from "./AllFlashCards";

const MainFlashCardsPage = (props: any) => {

    const navigate = useNavigate();

    const onAddNotes = () => {
        navigate("/flash_cards/all-cards");
    }

    const onCriterias = () => {
        navigate("/flash_cards/criteria");
    }

    const onDomain = () => {
        navigate("/flash_cards/domain");
    }

    const onAddFlashCards = () => {
        navigate("/flash_cards");
    }
    console.log("din welcome")
    console.log(localStorage.getItem("token"))

    return (
        <div className="page-container">
            <div className="welcome-container">
                <header className="header">
                    <div className="welcome-message">
                    </div>
                </header>
            </div>
            <div>
                <p> BLa bla bla intro</p>
            </div>

            <div className="sections-container">

                <section className="section">
                    <h2 className="section-title">Toate flashcardurile</h2>
                    <div className="button-container">
                        <button className="add-button2"
                                onClick={onAddNotes}>&#8594;</button>

                    </div>
                </section>

                <section className="section">
                    <h2 className="section-title">Criterii de testare</h2>
                    <div className="button-container">
                        <button className="add-button2"
                                onClick={onCriterias}>&#8594;</button>
                    </div>
                </section>

                <section className="section">
                    <h2 className="section-title">Domenii de testare</h2>
                    <div className="button-container">
                        <button className="add-button2"
                                onClick={onDomain}>&#8594;</button>
                    </div>
                </section>

                <section className="section">
                    <h2 className="section-title">Cardurile arhivate</h2>
                    <div className="button-container">
                        <button className="add-button2"
                                onClick={onAddFlashCards}>&#8594;</button>
                    </div>
                </section>
            </div>
        </div>
    );

}

export default MainFlashCardsPage;
