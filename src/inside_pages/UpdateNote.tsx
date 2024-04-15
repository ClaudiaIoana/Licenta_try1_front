import React, { useState, useEffect } from "react";
import {Link, Route, Routes, useLocation} from "react-router-dom";
import { Note } from "../models/Note";
import notes from "./Notes";

const UpdateNote = (props: any) =>{
    const location = useLocation();
    const noteDetail = location.state?.noteDetail || {};
    let [error, setError] = useState<string | null>(null);
    const [isRecipeAdded, setIsRecipeAdded] = useState(false);


    const [noteData, setNoteData] = useState({
        title : noteDetail.title,
        content: noteDetail.content,
        topic: noteDetail.topic,
        importance: noteDetail.importance,
        observations: noteDetail.observations,
    });

    const addNote = () => {
        console.log("for now");
    }


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

    const onSaveNewNote = async (event: { preventDefault: () => void }) =>{
        try{
            const response = await fetch(`http://127.0.0.1:8000/notes/${noteDetail.id}/`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        title: noteData.title,
                        topic: noteData.topic,
                        content: noteData.content,
                        observations: noteData.content,
                        importance: noteData.importance,
                        creator: noteDetail.creator,
                    }),
                    headers: {
                        Accept: "application/json",
                        'Authorization': `${localStorage.getItem("token")}`,
                        "Content-Type":
                            "application/json;charset=UTF-8;multipart/form-data",
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
                setIsRecipeAdded(true);
            }
        } catch (error) {
            console.log("blaaaaa")
            console.log(error)
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
                    <button className="add-button">&#8592;</button>
                </div>
            </section>
            <div className="add-note-container">
                <form onSubmit={addNote}>
                    <label>
                        Title:
                        <input
                            type="string"
                            name="title"
                            value={noteData.title}
                            onChange={handleDataChange}
                        />
                    </label>
                    <label>
                        Content:
                        <textarea
                            name="content"
                            value={noteData.content}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                handleDataChange(e)
                            }
                            rows={4}
                        />
                    </label>
                    <label>
                        Topic:
                        <input
                            type="string"
                            name="topic"
                            value={noteData.topic}
                            onChange={handleDataChange}
                        />
                    </label>
                    <label>
                        Observations:
                        <input
                            type="string"
                            name="observations"
                            value={noteData.observations}
                            onChange={handleDataChange}
                        />
                    </label>
                    <label>
                        Importance:
                        <input
                            type="number"
                            name="importance"
                            value={noteData.importance}
                            onChange={handleDataChange}
                        />
                    </label>
                </form>
                <div className="inputContainer">
                    <input
                        className="inputButton"
                        type="button"
                        onClick={onSaveNewNote}
                        value={"Update note"}
                    />
                </div>

            </div>
        </div>


    );
}

export default UpdateNote;