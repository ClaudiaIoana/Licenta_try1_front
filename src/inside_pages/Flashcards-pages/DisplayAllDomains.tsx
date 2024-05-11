import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Flashcard } from "../../models/Flashcard";
import {Criteria} from "../../models/Criteria";

const DisplayAllDomains = (props: any) => {
    const [height, setHeight] = useState('initial');
    const [allDomains, setAllDomains] = useState<Criteria[]>([]);
    const [selectedDomain, setSelectedDomain] = useState<Criteria | null>(null);
    const [unusedCards, setUnusedCards] = useState<Flashcard[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    let [error, setError] = useState<string | null>(null);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/flashcards/domains/`,
                    {
                        headers: {
                            'Authorization': `${localStorage.getItem("token")}`
                        }
                    }
                );
                const data = await response.json();
                setAllDomains(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleCancel = () => {
        window.location.href = `/flash_cards`;
    };

    const handleEditClick = (domain: Criteria) => {
        setSelectedDomain(domain);
        setIsEditing(true);
    };
    const handlePlusClick = (domain: Criteria) => {
        setSelectedDomain(domain);
        addFlashcardToDomain(domain);
    };

    const handleClosePopup = () => {
        setSelectedDomain(null);
        setIsEditing(false);
    };
    const handleEditDomain = async () => {
        try{
            const response = await fetch(`http://127.0.0.1:8000/flashcards/domains/${selectedDomain?.id}/`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        name: selectedDomain?.name,
                        details: selectedDomain?.details,
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
        window.location.href = `/flash_cards/domain`;
    };


    const addFlashcardToDomain = async (selectedDomain : Criteria) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/flashcards/domain_card/?domain=${selectedDomain.id}`,
                {
                    headers: {
                        'Authorization': `${localStorage.getItem("token")}`
                    }
                }
            );
            const data = await response.json();
            setUnusedCards(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const addCardToDomain = async (card: Flashcard, selectedDomain: Criteria) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/flashcards/domain_card/", {
                method: "POST",
                body: JSON.stringify({
                    domain: selectedDomain.id,
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

    const deleteCardFromDomain = async (card: Flashcard, selectedDomain: Criteria) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/flashcards/domain_card/", {
                method: "DELETE",
                body: JSON.stringify({
                    domain: selectedDomain.id,
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
                        <h1>Domeniile după care sunt organizate cardurile</h1>
                    </div>
                </header>
            </div>
            <div className="add-note-section">
                <Link to="/flash_cards/add_domain">
                    <button className="add-note-button">
                        <span className="plus-sign">+</span> Crează un nou domeniu
                    </button>
                </Link>
            </div>

            <div className="content-container">
                <div className="notes-container2">
                    <ul>
                        {allDomains.map((domain, index) => (
                            <li key={index}>
                                <div>
                                    <button onClick={() => handleEditClick(domain)}>Edit</button>
                                    <button onClick={() => handlePlusClick(domain)}>+</button>
                                    <Link to="/flash_cards/domain/card" state={{ domainCards: domain }}>{domain.name}</Link>
                                </div>
                                <ul>
                                    <li>{domain.details}</li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {selectedDomain && (
                <div className="popup">
                    <div className="popup-inner">
                        <button className="exit-button" onClick={handleClosePopup}>X</button>
                        <ul>
                            {unusedCards.map((card, index) => (
                                <li key={index}>
                                    <p>Front: {card.front}</p>
                                    <p>Back: {card.back}</p>
                                    <button onClick={() => addCardToDomain(card, selectedDomain)}>Add</button>
                                    <button onClick={() => addCardToDomain(card, selectedDomain)}>Delete</button>
                                    <button onClick={() => addCardToDomain(card, selectedDomain)}>Update</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {isEditing && selectedDomain && (
                <div className="popup">
                    <div className="popup-inner">
                        <button className="exit-button" onClick={handleClosePopup}>X</button>
                        {/* Your editing form goes here */}
                        <input
                            type="text"
                            value={selectedDomain.name}
                            onChange={(e) => setSelectedDomain({ ...selectedDomain, name: e.target.value })}
                        />
                        <textarea
                            value={selectedDomain.details}
                            onChange={(e) => setSelectedDomain({ ...selectedDomain, details: e.target.value })}
                        />
                        <button onClick={handleEditDomain}>Save</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisplayAllDomains;
