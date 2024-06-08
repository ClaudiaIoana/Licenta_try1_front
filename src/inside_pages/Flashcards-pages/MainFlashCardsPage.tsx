import React, { useState, useEffect, useRef } from "react";
import {Link, useNavigate} from "react-router-dom";
import {Note} from "../../models/Note";
import {Flashcard} from "../../models/Flashcard";
import AllFlashCards from "./AllFlashCards";
import cornerImage from "C:\\LICENTA\\front_try2\\src\\images\\cornerImg-removebg-preview.png";


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

    const onArchivedCards = () =>{
        navigate("/flash_cards/archive");
    }

    const handleCancel = () => {
        window.location.href = `/welcome`;
    };

    const onAddFlashCards = () => {
        navigate("/flash_cards");
    }
    console.log("din welcome")
    console.log(localStorage.getItem("token"))

    return (
        <div className="page-container">
            <img src={cornerImage} alt="Corner Image" className="corner-image-left" />

            <div className="welcome-container">
                <section>
                    <div className="arrow-container" onClick={handleCancel}>
                        <button className="arrow-button">🔙</button>
                    </div>
                </section>
                <header className="header">
                    <div className="welcome-message">
                    </div>
                </header>
            </div>

            <div className="sections-container">

                <section className="section">
                    <h2 className="section-title">Toate flashcardurile</h2>
                    <div className="button-container">
                        <button className="add-button2"
                                onClick={onAddNotes}>💊</button>
                        <span>Navighează spre flashcardurile tale.</span>

                    </div>
                </section>

                <section className="section">
                    <h2 className="section-title">Categorii de testare</h2>
                    <div className="button-container">
                        <button className="add-button2"
                                onClick={onCriterias}>
                            🩻</button>
                        <span>Testează-ți cunoștițele în funcție de anumite categorii.</span>
                    </div>
                </section>

                <section className="section">
                    <h2 className="section-title">Domenii de testare</h2>
                    <div className="button-container">
                        <button className="add-button2"
                                onClick={onDomain}>🩸</button>
                        <span>Testează-ți cunoștițele în funcție de anumite domenii.</span>

                    </div>
                </section>

                <section className="section">
                    <h2 className="section-title">Cardurile arhivate</h2>
                    <div className="button-container">
                        <button className="add-button2"
                                onClick={onArchivedCards}>🧫</button>
                        <span>Navighează spre flashcardurile tale arhivate.</span>
                    </div>
                </section>
            </div>
        </div>
    );

}

export default MainFlashCardsPage;
