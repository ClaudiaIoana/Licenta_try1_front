import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Criteria } from "../../models/Criteria";
import { Flashcard } from "../../models/Flashcard";

const DisplayAllCriteria = (props: any) => {
    const [height, setHeight] = useState('initial');
    const [allCriteria, setAllCriteria] = useState<Criteria[]>([]);
    const [selectedCriteria, setSelectedCriteria] = useState<Criteria | null>(null);
    const [unusedCards, setUnusedCards] = useState<Flashcard[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    let [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/flashcards/category/`,
                    {
                        headers: {
                            'Authorization': `${localStorage.getItem("token")}` // Assuming you're using Token-based authentication
                        }
                    }
                );
                const data = await response.json();
                setAllCriteria(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleCancel = () => {
        window.location.href = `/flash_cards`;
    };
    const handleEditClick = (criteria: Criteria) => {
        setSelectedCriteria(criteria);
        setIsEditing(true);
    };

    const handlePlusClick = (criteria: Criteria) => {
        setSelectedCriteria(criteria);
        addFlashcardToCriteria(criteria);
    };

    const handleClosePopup = () => {
        setSelectedCriteria(null);
        setIsEditing(false);
    };

    const handleEditCriteria = async () => {
        try{
            const response = await fetch(`http://127.0.0.1:8000/flashcards/category/${selectedCriteria?.id}/`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        name: selectedCriteria?.name,
                        details: selectedCriteria?.details,
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
                setIsEditing(false);
            }
        } catch (error) {
            console.log("blaaaaa")
            console.log(error)
            console.error(error);
            setError("An unexpected error occurred");
        }
        window.location.href = `/flash_cards/criteria`;
    };

    const addFlashcardToCriteria = async (selectedCriteria: Criteria) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/flashcards/category_card/?criteria=${selectedCriteria.id}`,
                {
                    headers: {
                        'Authorization': `${localStorage.getItem("token")}` // Assuming you're using Token-based authentication
                    }
                }
            );
            const data = await response.json();
            setUnusedCards(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const addCardToCriteria = async (card: Flashcard, selectedCriteria: Criteria) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/flashcards/category_card/", {
                method: "POST",
                body: JSON.stringify({
                    category: selectedCriteria.id,
                    card: card.id,
                }),
                headers: {
                    Accept: "application/json",
                    'Authorization': `${localStorage.getItem("token")}`,
                    "Content-Type": "application/json;charset=UTF-8;multipart/form-data",
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            }
        } catch (error) {
            console.error(error);
        }
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

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
                        <h1>Categoriile după care sunt organizate cardurile</h1>
                    </div>
                </header>
            </div>
            <div className="add-note-section">
                <Link to="/flash_cards/add_criteria">
                    <button className="add-note-button">
                        <span className="plus-sign">+</span> Crează un nou criteriu
                    </button>
                </Link>
            </div>

            <div className="content-container">
                <div className="notes-container2">
                    <ul>
                        {allCriteria.map((criteria, index) => (
                            <li key={index}>
                                <div>
                                    <button onClick={() => handlePlusClick(criteria)}>+</button>
                                    <button onClick={() => handleEditClick(criteria)}>Edit</button>
                                    <Link to="/flash_cards/criteria/card" state={{ criteriaCards: criteria }}>{criteria.name}</Link>
                                </div>
                                <ul>
                                    <li>{criteria.details}</li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {selectedCriteria && (
                <div className="popup">
                    <div className="popup-inner">
                        <button className="exit-button" onClick={handleClosePopup}>X</button>
                        <ul>
                            {unusedCards.map((card, index) => (
                                <li key={index}>
                                    <p>Front: {card.front}</p>
                                    <p>Back: {card.back}</p>
                                    <button onClick={() => addCardToCriteria(card, selectedCriteria)}>Add</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {isEditing && selectedCriteria && (
                <div className="popup">
                    <div className="popup-inner">
                        <button className="exit-button" onClick={handleClosePopup}>X</button>
                        {/* Your editing form goes here */}
                        <input
                            type="text"
                            value={selectedCriteria.name}
                            onChange={(e) => setSelectedCriteria({ ...selectedCriteria, name: e.target.value })}
                        />
                        <textarea
                            value={selectedCriteria.details}
                            onChange={(e) => setSelectedCriteria({ ...selectedCriteria, details: e.target.value })}
                        />
                        <button onClick={handleEditCriteria}>Save</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisplayAllCriteria;
