import React from 'react';
import {Link, Route, Routes, useNavigate} from 'react-router-dom';
import "./the_css_file.css";
import AddNote from "./AddNote";

const WelcomePage = (props:any) => {
    const navigate = useNavigate();

    const onAddNotes = () => {
        navigate("/notes");
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
                <Link to="/logout" className="logout-button">Deconectare</Link>
            </header>
        </div>
            <div>
                <p> BLa bla bla intro</p>
            </div>

            <div className="sections-container">

                <section className="section">
                    <h2 className="section-title">Notițe</h2>
                    <div className="button-container">
                        <button className="add-button2"
                                onClick={onAddNotes}>&#8594;</button>
                        <span>Mergi la notițele tale.</span>
                    </div>
                </section>

                <section className="section">
                    <h2 className="section-title">Flashcarduri</h2>
                    <div className="button-container">
                        <button className="add-button2"
                        onClick={onAddFlashCards}>&#8594;</button>
                        <span>Testează-ți cunoștințele folosind flashcarduri.</span>
                    </div>
                </section>

                <section className="section">
                    <h2 className="section-title">Chatbot</h2>
                    <div className="button-container">
                        <button className="add-button2"
                                onClick={onAddFlashCards}>&#8594;</button>
                        <span>Comunică cu chatbotul pentru a înțelege mai multe despre boli.</span>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default WelcomePage;
