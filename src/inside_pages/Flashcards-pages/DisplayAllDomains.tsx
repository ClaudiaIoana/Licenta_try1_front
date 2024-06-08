import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Flashcard } from "../../models/Flashcard";
import {Criteria} from "../../models/Criteria";

const DisplayAllDomains = (props: any) => {
    const [height, setHeight] = useState('initial');
    const [allDomains, setAllDomains] = useState<Criteria[]>([]);
    const [selectedDomain, setSelectedDomain] = useState<Criteria | null>(null);
    const [unusedCards, setUnusedCards] = useState<Flashcard[]>([]);
    const [cardsOnDomain, setCardsOnDomain] = useState<Flashcard[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false);
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
        setIsAddCardPopupOpen(true);
        addFlashcardToDomain(domain);
        getFlashcardsOnDomain(domain);
    };

    const handleClosePopup = () => {
        setSelectedDomain(null);
        setIsEditing(false);
        setIsAddCardPopupOpen(false);
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

    const getFlashcardsOnDomain = async (selectedDomain : Criteria) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/flashcards/flashcards/?domain=${selectedDomain.id}`,
                {
                    headers: {
                        'Authorization': `${localStorage.getItem("token")}`
                    }
                }
            );
            const data = await response.json();
            setCardsOnDomain(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleDeleteDomain = (domain: Criteria) => {
        setSelectedDomain(domain);
        setIsDeletePopupOpen(true);
    };

    const handleDeleteConfirmation = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/flashcards/domains/${selectedDomain?.id}`, {
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
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                throw new Error("Failed to delete note");
            }
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };


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
        handleClosePopup();
    }

    const deleteCardFromDomain = async (card: Flashcard, selectedDomain: Criteria) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/flashcards/domain_card/0`, {
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
        handleClosePopup();
    };


    return (
        <div>
            <div className="welcome-container">
                <section>
                    <div className="arrow-container" onClick={handleCancel}>
                        <button className="arrow-button">🔙</button>
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
                        <span className="plus-sign">+</span> Crează un domeniu
                    </button>
                </Link>
            </div>

            <div className="content-container">
                <table className="notes-container6">
                    <tr className="table-header">
                        <th className="table-header-text">Nume</th>
                        <th className="table-header-text">Detalii</th>
                        <th className="table-header-text">Modifică</th>
                        <th className="table-header-text">Șterge</th>
                        <th className="table-header-text">Editează flashcardurile</th>
                    </tr>
                    {allDomains.map((domain, index) => (
                        <tr key={index} className="table-row">
                            <td><Link to="/flash_cards/domain/card" state={{ criteriaCards: domain }}>{domain.name}</Link></td>
                            <td>{domain.details}</td>
                            <td>
                                <button onClick={() => handleEditClick(domain)}>Modifică</button>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteDomain(domain)}>Șterge</button>
                            </td>
                            <td>
                                <button onClick={() => handlePlusClick(domain)}>Editează</button>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>

            {selectedDomain && isAddCardPopupOpen &&(
                <div className="popup-edit-flashcards">
                    <div className="popup-inner-edit-flashcards">
                        <button className="exit-button" onClick={handleClosePopup}>X</button>
                        <h2>Flashcarduri care pot fi adaugate la domeniul de testare</h2>
                        <ul>
                            {unusedCards.map((card, index) => (
                                <li key={index}>
                                    <p>Față: {card.front}</p>
                                    <p>Spate: {card.back}</p>
                                    <button onClick={() => addCardToDomain(card, selectedDomain)} className="button-popup">Adaugă</button>
                                </li>
                            ))}
                        </ul>
                        <h2>Flashcarduri care apartin domeniului de testare</h2>
                        <ul>
                            {cardsOnDomain.map((card, index) => (
                                <li key={index}>
                                    <p>Față: {card.front}</p>
                                    <p>Spate: {card.back}</p>
                                    <button onClick={() => deleteCardFromDomain(card, selectedDomain)}  className="button-popup">Șterge</button>
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
                        <h2>Modifică domeniul</h2>
                        <div>
                        <label>
                            Nume:
                            <br/>
                            <input
                                type="text"
                                className="inputField update-criteria-field"
                                value={selectedDomain.name}
                                onChange={(e) => setSelectedDomain({ ...selectedDomain, name: e.target.value })}
                            />
                        </label>
                        </div>
                        <div>
                        <label>
                            Detalii:
                            <br/>
                            <input
                                type="text"
                                className="inputField update-criteria-field"
                                value={selectedDomain.details}
                                onChange={(e) => setSelectedDomain({ ...selectedDomain, details: e.target.value })}

                            />
                        </label>
                        </div>
                        <button onClick={handleEditDomain} style={{ background: '#0056b3' }}>Save</button>
                    </div>
                </div>
            )}

            {isDeletePopupOpen && selectedDomain && (
                <div className="popup">
                    <div className="popup-inner">
                        <button className="exit-button" onClick={() => setIsDeletePopupOpen(false)}>X</button>
                        <h2>Ești sigur că vrei să șteri acest domeniu?</h2>
                        <p>{selectedDomain.name}</p>
                        <button onClick={handleDeleteConfirmation} style={{ background: '#0056b3' }}>Da</button>
                        <button onClick={() => setIsDeletePopupOpen(false)} style={{ marginLeft: '30px', background: '#0056b3' }}>Nu</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DisplayAllDomains;
