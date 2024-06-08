import React, { useState, useEffect } from "react";
import { Questions } from "../models/Questions";

const OldQuestions = () => {
    const [allQuestions, setAllQuestions] = useState<Questions[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Questions | null>(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/chatbot/ask/`,
                    {
                        headers: {
                            'Authorization': `${localStorage.getItem("token")}`
                        }
                    }
                );
                const data = await response.json();
                setAllQuestions(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const createFlashcard = async (question: Questions) => {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/flashcards/flashcards/",
                {
                    method: "POST",
                    body: JSON.stringify({
                        front: question.question,
                        back: question.response,
                        creator: localStorage.getItem("userID"),
                    }),
                    headers: {
                        Accept: "application/json",
                        Authorization: `${localStorage.getItem("token")}`,
                        "Content-Type": "application/json;charset=UTF-8",
                    },
                }
            );

            if (response.ok) {
                setShowSuccessPopup(true);
                setTimeout(() => setShowSuccessPopup(false), 5000);
            } else {
                throw new Error("Failed to create flashcard");
            }
        } catch (error) {
            console.error(error);
            setError("An unexpected error occurred");
        }
    };

    const deleteAnswer = async (question: Questions) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/chatbot/ask/${question.id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    'Authorization': `${localStorage.getItem("token")}`,
                    "Content-Type": "application/json;charset=UTF-8",
                },
            });
            if (response.ok) {
                setAllQuestions(allQuestions.filter(q => q.id !== question.id));
            }
        } catch (error) {
            console.error(error);
        }
        handleClosePopup();
    };

    const handleOpenPopup = (question: Questions) => {
        setSelectedQuestion(question);
        setIsDeletePopupOpen(true);
    };

    const handleClosePopup = () => {
        setSelectedQuestion(null);
        setIsDeletePopupOpen(false);
    };

    const handleCancel = () => {
        window.location.href = `/chat-bot/`;
    };

    return (
        <div>
            <div className="welcome-container">
                <section>
                    <div className="arrow-container" onClick={handleCancel}>
                        <button className="arrow-button">🔙</button>
                    </div>
                </section>
            </div>

            <div className="content-container">
                <div className="questions-container">
                    {allQuestions.map((question, index) => (
                        <div key={index} className={`questions-display`}>
                            <div style={{ marginBottom: "10px" }}>
                                <h2 className="title">
                                    {question.question}
                                </h2>
                                <div className="topic">
                                    {question.response}
                                </div>
                            </div>
                            <button onClick={() => handleOpenPopup(question)}
                                    className="options-chat-archive">Șterge</button>
                            {/*<button onClick={() => createFlashcard(question)} className="options-chat-archive">Transformă în flashcard</button>*/}
                        </div>
                    ))}
                </div>
            </div>
            {isDeletePopupOpen && selectedQuestion && (
                <div className="popup">
                    <div className="popup-inner">
                        <button className="exit-button" onClick={handleClosePopup}>X</button>
                        <h2>Ești sigur că vrei să ștergi acest răspuns?</h2>
                        <button onClick={() => deleteAnswer(selectedQuestion)}>Yes</button>
                        <button onClick={handleClosePopup}>No</button>
                    </div>
                </div>
            )}
            {showSuccessPopup && (
                <div className="success-popup">
                    <div className="success-popup-inner">
                        <p>Operațiunea a fost un succes!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OldQuestions;
