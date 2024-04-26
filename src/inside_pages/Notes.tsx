import React, { useState, useEffect } from "react";
import {Link, Route, Routes} from "react-router-dom";
import { Note } from "../models/Note";
import AddNote from "./AddNote";
import DetailsNote from "./DetailsNote";

const Notes = (props: any) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [desiredCommand, setDesiredCommand] = useState(0);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/notes/`,
                    {
                        headers: {
                            'Authorization': `${localStorage.getItem("token")}` // Assuming you're using Token-based authentication
                        }
                    }
                );
                const data = await response.json();
                setAllNotes(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    console.log(localStorage.getItem("userID"));

    const handleCancel = () => {
        window.location.href = `/welcome`;
    };

    const handleDetails = (note: Note) => {
        setSelectedNote(note);
    };

    return (
        <div>
            <div className="welcome-container">
                <section>
                    <div className="arrow-container" onClick={handleCancel}>
                        <button className="arrow-button">&#8592;</button>
                    </div>
                </section>
                <header className="header">
                    <div className="welcome-message">
                        <h1>Notițele tale</h1>
                    </div>
                    <Link to="/logout" className="logout-button">Deconectare</Link>
                </header>
            </div>
            <div className="add-note-section">
                <Link to="/add-note">
                    <button className="add-note-button">
                        <span className="plus-sign">+</span> Crează o nouă notiță
                    </button>
                </Link>
            </div>

            <div className="content-container">
                <div className="notes-container">
                    {allNotes.map((note, index) => (
                        <div key={index} className={`note-cube note-type-${index % 8}`}>
                            <div style={{ marginBottom: "10px" }}>
                                <h2 className="title">
                                    {note.title}
                                </h2>
                                <div className="topic">
                                    Topic: {note.topic}
                                </div>
                            </div>
                            <Link to="/details-note" state={{ noteDetail: note }} className="details-button">Detalii</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notes;
