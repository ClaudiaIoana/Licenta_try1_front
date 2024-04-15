
import React, { useState, useEffect, CSSProperties } from "react";
import { Link, Route, Routes } from "react-router-dom";

import {Note} from "../models/Note";

const FlashCards = (props: any) => {
    const [flash_cards, setFlashCards] = useState<Note[]>([]);
    const [allflash_cards, setAllFlashCards] = useState<Note[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/notes/`
                );
                const data = await response.json();
                setAllFlashCards(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleCancel = () => {
        window.location.href = `/welcome`;
    };
    console.log(localStorage.getItem("token"))

    return (
        <div className="welcome-container">
            <section>
                <div className="arrow-container" onClick={handleCancel}>
                    <button className="arrow-button">&#8592;</button>
                </div>
            </section>
            <header className="header">
                <div className="welcome-message">
                    <h1>Your flash cards</h1>
                </div>
                <Link to="/logout" className="logout-button">Logout</Link>
            </header>
        </div>
    );
};

export default FlashCards;
