import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Criteria } from "../../models/Criteria";
import { Flashcard } from "../../models/Flashcard";

const DisplayAllCriteria = (props: any) => {
    const [height, setHeight] = useState('initial');
    const [allCriteria, setAllCriteria] = useState<Criteria[]>([]);
    const [selectedCriteria, setSelectedCriteria] = useState<Criteria | null>(null);
    const [unusedCards, setUnusedCards] = useState<Flashcard[]>([]);
    const [cardsOnCriteria, setCardsOnCriteria] = useState<Flashcard[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false);
    let [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/flashcards/category/`,
                    {
                        headers: {
                            'Authorization': `${localStorage.getItem("token")}`
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
        setIsAddCardPopupOpen(true);
        addFlashcardToCriteria(criteria);
        getFlashcardsOnCriteria(criteria);
    };

    const handleClosePopup = () => {
        setSelectedCriteria(null);
        setIsEditing(false);
        setIsAddCardPopupOpen(false);
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

    const getFlashcardsOnCriteria = async (selectedCriteria : Criteria) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/flashcards/flashcards/?criteria=${selectedCriteria.id}`,
                {
                    headers: {
                        'Authorization': `${localStorage.getItem("token")}`
                    }
                }
            );
            const data = await response.json();
            setCardsOnCriteria(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleDeleteCriteria = (criteria: Criteria) => {
        setSelectedCriteria(criteria);
        setIsDeletePopupOpen(true);
    };

    const handleDeleteConfirmation = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/flashcards/category/${selectedCriteria?.id}`, {
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
        handleClosePopup();
    }

    const deleteCardFromCriteria = async (card: Flashcard, selectedCriteria: Criteria) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/flashcards/category_card/0`, {
                method: "DELETE",
                body: JSON.stringify({
                    criteria: selectedCriteria.id,
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
                        <h1>Categoriile după care sunt organizate cardurile</h1>
                    </div>
                </header>
            </div>
            <div className="add-note-section">
                <Link to="/flash_cards/add_criteria">
                    <button className="add-note-button">
                        <span className="plus-sign">+</span> Crează o categorie
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
                    {allCriteria.map((criteria, index) => (
                        <tr key={index} className="table-row">
                            <td><Link to="/flash_cards/criteria/card" state={{ criteriaCards: criteria }}>{criteria.name}</Link></td>
                            <td>{criteria.details}</td>
                            <td>
                                <button onClick={() => handleEditClick(criteria)}>Modifică</button>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteCriteria(criteria)}>Șterge</button>
                            </td>
                            <td>
                                <button onClick={() => handlePlusClick(criteria)}>Editează</button>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>

            {selectedCriteria && isAddCardPopupOpen && (
                <div className="popup-edit-flashcards">
                    <div className="popup-inner-edit-flashcards">
                        <button className="exit-button" onClick={handleClosePopup}>X</button>
                        <h2>Flashcarduri care pot fii adaugate la criteriul de testare</h2>
                        <ul>
                            {unusedCards.map((card, index) => (
                                <li key={index}>
                                    <p>Față: {card.front}</p>
                                    <p>Spate: {card.back}</p>
                                    <button onClick={() => addCardToCriteria(card, selectedCriteria)} className="button-popup">Adaugă</button>
                                </li>
                            ))}
                        </ul>
                        <h2>Flashcarduri care apartin criteriului de testare</h2>
                        <ul>
                            {cardsOnCriteria.map((card, index) => (

                                    <li key={index}>
                                        <p>Față: {card.front}</p>
                                        <p>Spate: {card.back}</p>
                                        <button onClick={() => deleteCardFromCriteria(card, selectedCriteria)} className="button-popup">Șterge</button>
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
                        <h2>Modifică categoria</h2>
                        <div>
                            <label>
                                Nume:
                                <br/>
                                    <input
                                        type="text"
                                        className="inputField update-criteria-field"
                                        value={selectedCriteria.name}
                                        onChange={(e) => setSelectedCriteria({ ...selectedCriteria, name: e.target.value })}
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
                                    value={selectedCriteria.details}
                                    onChange={(e) => setSelectedCriteria({ ...selectedCriteria, details: e.target.value })}
                                />
                            </label>
                        </div>
                        <button onClick={handleEditCriteria} className="button-popup">Salvează</button>
                    </div>
                </div>
            )}

            {isDeletePopupOpen && selectedCriteria && (
                <div className="popup">
                    <div className="popup-inner">
                        <button className="exit-button" onClick={() => setIsDeletePopupOpen(false)}>X</button>
                        <h2>Ești sigur că vrei să ștergi această categorie?</h2>
                        <p>{selectedCriteria.name}</p>
                        <button onClick={handleDeleteConfirmation} style={{ background: '#0056b3' }}>Da</button>
                        <button onClick={() => setIsDeletePopupOpen(false)} style={{ marginLeft: '30px' , background: '#0056b3' }}>Nu</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisplayAllCriteria;
