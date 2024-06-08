import React, { useState } from "react";
import { Link } from "react-router-dom";

const AddNote = () => {
    const [noteData, setNoteData] = useState({
        title: "",
        topic: "",
        importance: "",
        content: "",
        observations: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [isNoteAdded, setIsNoteAdded] = useState(false);

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNoteData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        window.location.href = "/notes";
    };

    const onSaveNewNote = async (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        event.preventDefault();

        // Check if any field is empty or if importance is not a number
        if (!noteData.title || !noteData.topic || !noteData.importance || isNaN(Number(noteData.importance))) {
            setError("Oops. Ori ai uitat să completezi un field ori ai uitat că importanța trebuie exprimată printr-un număr. :)");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/notes/", {
                method: "POST",
                body: JSON.stringify({
                    title: noteData.title,
                    topic: noteData.topic,
                    content: noteData.content,
                    observations: noteData.observations,
                    importance: noteData.importance,
                    creator: localStorage.getItem("userID"),
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
                    setError("Note addition failed");
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
            setError("A apărut o eroare. :(");
        }
        setTimeout(() => {
            window.location.href = "/notes";
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
                            rows={20}
                        />
                    </label>
                    <label>
                        Observații:
                        <textarea
                            name="observations"
                            value={noteData.observations}
                            onChange={handleDataChange}
                            rows={10}
                        />
                    </label>
                    <input
                        className="add-note-button"
                        type="button"
                        onClick={onSaveNewNote}
                        value={"Salvează"}
                    />
                </form>
            </div>
        </div>
    );
};

export default AddNote;
