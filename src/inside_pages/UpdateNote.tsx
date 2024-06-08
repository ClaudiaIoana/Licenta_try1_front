import React, { useState, useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { Note } from "../models/Note";
import notes from "./Notes";

const UpdateNote = (props: any) => {
    const location = useLocation();
    const noteDetail = location.state?.noteDetail || {};
    let [error, setError] = useState<string | null>(null);
    const [isNoteAdded, setIsNoteAdded] = useState(false);

    const [noteData, setNoteData] = useState({
        title: noteDetail.title,
        content: noteDetail.content,
        topic: noteDetail.topic,
        importance: noteDetail.importance,
        observations: noteDetail.observations,
    });

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log(name, value);
        setNoteData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        window.location.href = `/notes`;
    };

    const onSaveNewNote = async (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        event.preventDefault();

        // Check if any field is empty or if importance is not a number
        console.log(noteData)
        if (!noteData.title || !noteData.topic || !noteData.importance || isNaN(Number(noteData.importance))) {
            setError("Oops. Ori ai uitat să completezi un field ori ai uitat că importanța trebuie exprimată printr-un număr. :)");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/notes/${noteDetail.id}/`, {
                method: "PUT",
                body: JSON.stringify({
                    title: noteData.title,
                    topic: noteData.topic,
                    content: noteData.content,
                    observations: noteData.observations,
                    importance: noteData.importance,
                    creator: noteDetail.creator,
                }),
                headers: {
                    Accept: "application/json",
                    Authorization: `${localStorage.getItem("token")}`,
                    "Content-Type": "application/json;charset=UTF-8;multipart/form-data",
                },
            });
            if (!response.ok) {
                if (response.status === 400) {
                    setError("Bad Request: Invalid data");
                } else {
                    setError("Note update failed");
                }
                console.error("Error response:", response.status);
                console.log(error);
            } else {
                const data = await response.json();
                console.log(data);
                setIsNoteAdded(true);
            }
        } catch (error) {
            console.log("An unexpected error occurred");
            console.error(error);
            setError("An unexpected error occurred");
        }
        setTimeout(() => {
            window.location.href = `/notes`;
        }, 500);
    };

    return (
        <div>
            <section>
                <div className="arrow-container" onClick={handleCancel}>
                    <button className="arrow-button">🔙</button>
                </div>
            </section>
            <div className="add-note-container">
                {error && <div className="error">{error}</div>}
                <form>
                    <div className="input-group">
                        <label>
                            Titlu:
                            <input
                                type="text"
                                name="title"
                                value={noteData.title}
                                onChange={handleDataChange}
                            />
                        </label>
                        <label>
                            Topic:
                            <input
                                type="text"
                                name="topic"
                                value={noteData.topic}
                                onChange={handleDataChange}
                            />
                        </label>
                        <label>
                            Importanță:
                            <input
                                type="number"
                                name="importance"
                                value={noteData.importance}
                                onChange={handleDataChange}
                            />
                        </label>
                    </div>
                    <label>
                        Content:
                        <textarea
                            name="content"
                            value={noteData.content}
                            onChange={handleDataChange}
                            rows={25}
                        />
                    </label>
                    <label>
                        Observații:
                        <textarea
                            name="observations"
                            value={noteData.observations}
                            onChange={handleDataChange}
                            rows={7}
                        />
                    </label>
                </form>
                <input
                    className="add-note-button"
                    type="button"
                    onClick={onSaveNewNote}
                    value={"Salvează"}
                />
            </div>
        </div>
    );
}

export default UpdateNote;
