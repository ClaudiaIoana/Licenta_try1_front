import React, { useState, useEffect } from "react";
import {Link, Routes} from "react-router-dom";
import { Note } from "../models/Note";
import Notes from "./Notes";
import notes from "./Notes";


const AddNote = () => {
    let [error, setError] = useState<string | null>(null);
    const [isRecipeAdded, setIsRecipeAdded] = useState(false);


    const [noteData, setNoteData] = useState({
        title : "",
        content: "",
        topic: "",
        importance: "",
        observations: "",
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
        console.log('here')
        try{
            const response = await fetch("http://127.0.0.1:8000/notes/",
                {
                    method: "POST",
                    body: JSON.stringify({
                        title: noteData.title,
                        topic: noteData.topic,
                        content: noteData.content,
                        observations: noteData.content,
                        importance: noteData.importance,
                        creator: localStorage.getItem("userID"),
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
                        rows={10}
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
                    <textarea
                        name="observations"
                        value={noteData.observations}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            handleDataChange(e)
                        }
                        rows={10}
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
            <input
                className="add-note-button"
                type="button"
                onClick={onSaveNewNote}
                value={"Add note"}
                />

        </div>
        </div>


    );

}

export default AddNote;