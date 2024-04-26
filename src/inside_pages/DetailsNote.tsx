import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import MyComponent from "./MyComponent";

const DetailsNote = () => {
    const location = useLocation();
    const noteDetail = location.state?.noteDetail || {};

    const [formData, setFormData] = useState({
        title: "",
        topic: "",
        content: "",
        importance: 0,
        observations: "",
    });

    useEffect(() => {
        setFormData({
            title: noteDetail.title,
            topic: noteDetail.topic,
            content: noteDetail.content,
            importance: noteDetail.importance,
            observations: noteDetail.observations,
        });
    }, [noteDetail]);

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/notes/${noteDetail.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const responseData = await response.text();
                if (responseData) {
                    const data = JSON.parse(responseData);
                    console.log(data);
                }
                setShowConfirmation(false);
                setTimeout(() => {
                    window.location.href = `/notes`;
                }, 500);
            } else {
                throw new Error("Failed to delete note");
            }
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const confirmDelete = () => {
        setShowConfirmation(true);
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
    };

    return (
        <div>
            <div>
                <h1>{String(formData.title)}</h1>
            </div>

        <div className="details-container">
            <div className="left-section">
                <p>
                    <b>
                        {String(formData.content)}
                    </b>
                </p>
            </div>
            <div className="right-section">
                <p>
                    <b>
                        {"Topics: ".concat(String(formData.topic))}
                    </b>
                </p>
                <p>
                    <b>
                        {"Observations: ".concat(String(formData.observations))}
                    </b>
                </p>
                <p>
                    <b>
                        {"Importance: ".concat(String(formData.importance))}
                    </b>
                </p>
                <Link to="/update-note" state={{ noteDetail: noteDetail }} className="update-button">
                    Update
                </Link>
                <button onClick={confirmDelete} className="delete-button">
                    Delete
                </button>
                {showConfirmation && (
                    <div className="confirmation-popup">
                        <p>Are you sure you want to delete this note?</p>
                        <button onClick={handleDelete}>Yes</button>
                        <button onClick={cancelDelete}>No</button>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
};

export default DetailsNote;
