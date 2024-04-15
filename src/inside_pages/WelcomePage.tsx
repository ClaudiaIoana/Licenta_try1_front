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
        <div>
        <div className="welcome-container">
            <header className="header">
                <div className="welcome-message">
                    <h1>Welcome to Your New Learning Environment</h1>
                    <p>We are glad to have you here!</p>
                </div>
                <Link to="/logout" className="logout-button">Logout</Link>
            </header>
        </div>
            <div className="sections-container">

                <section className="section">
                    <h2 className="section-title">Section 1</h2>
                    <div className="button-container">
                        <button className="add-button2"
                                onClick={onAddNotes}>&#8594;</button>
                        <span>Navigate to your notes</span>
                    </div>
                </section>

                <section className="section">
                    <h2 className="section-title">Section 2</h2>
                    <div className="button-container">
                        <button className="add-button2"
                        onClick={onAddFlashCards}>&#8594;</button>
                        <span>Navigate to your flash cards</span>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default WelcomePage;
