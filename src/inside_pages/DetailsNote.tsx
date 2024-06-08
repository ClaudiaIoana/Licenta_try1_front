import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

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

    const [showSidebar, setShowSidebar] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        setFormData({
            title: noteDetail.title,
            topic: noteDetail.topic,
            content: noteDetail.content,
            importance: noteDetail.importance,
            observations: noteDetail.observations,
        });
    }, [noteDetail]);

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

    const handleCancel = () => {
        window.location.href = `/notes`;
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <div className="page-container">
            <div className={`sidebar ${showSidebar ? "visible" : ""}`}>
                <div className="sidebar-header">
                    <button className="close-button" onClick={toggleSidebar}>×</button>
                </div>
                <div className="sidebar-content text-left">
                    <p>
                        <b>Topicuri: </b>
                        <span dangerouslySetInnerHTML={{ __html: formData.topic.replace(/\n/g, '<br>') }} />
                    </p>
                    <p>
                        <b>Observații: </b>
                        <span dangerouslySetInnerHTML={{ __html: formData.observations.replace(/\n/g, '<br>') }} />
                    </p>
                    <p>
                        <b>Importanță: </b>
                        <span dangerouslySetInnerHTML={{ __html: formData.importance.toString().replace(/\n/g, '<br>') }} />
                    </p>
                    <Link
                        to="/update-note"
                        state={{ noteDetail: noteDetail }}
                        className="update-button button-style"
                    >
                        Modifică
                    </Link>
                    <button onClick={confirmDelete} className="delete-button button-style">
                        Șterge
                    </button>
                </div>
            </div>
            <div className="main-content">
                <button className="toggle-button" onClick={toggleSidebar}>
                    ☰
                    <span className="hover-text">Vezi observațiile</span>
                </button>
                <div className="details-container">
                    <div className="left-section2">
                        <section>
                            <div className="arrow-container" onClick={handleCancel}>
                                <button className="arrow-button">🔙</button>
                            </div>
                        </section>
                        <div>
                            <h1>{String(formData.title)}</h1>
                        </div>
                        <p className="text-left">
                            <b>
                                <span dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br>') }} />
                            </b>
                        </p>
                    </div>
                </div>
                {showConfirmation && (
                    <div className="popup">
                        <div className="popup-inner">
                            <button className="exit-button" onClick={() => setShowConfirmation(false)}>X</button>
                            <p>Ești sigur că vrei să ștergi această notiță?</p>
                            <button onClick={handleDelete} style={{ background: '#0056b3' }}>Da</button>
                            <button onClick={cancelDelete} style={{ marginLeft: '30px', background: '#0056b3' }}>Nu</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailsNote;
