import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Flashcard } from "../../models/Flashcard";

const ArchivedCards = (props: any) => {
    const [height, setHeight] = useState('initial');
    const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([]);
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

    const frontEls = useRef<(HTMLDivElement | null)[]>([]);
    const backEls = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/flashcards/flashcards/?archived=True`,
                    {
                        headers: {
                            'Authorization': `${localStorage.getItem("token")}`
                        }
                    }
                );
                const data = await response.json();
                setAllFlashcards(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    function setMaxHeight() {
        let maxHeight = 0;
        frontEls.current.forEach((el, index) => {
            const frontHeight = el?.getBoundingClientRect().height || 0;
            const backHeight = backEls.current[index]?.getBoundingClientRect().height || 0;
            maxHeight = Math.max(maxHeight, frontHeight, backHeight);
        });
        setHeight(`${maxHeight}px`);
    }

    useEffect(() => {
        setMaxHeight();
        window.addEventListener('resize', setMaxHeight);
        return () => window.removeEventListener('resize', setMaxHeight);
    }, []);

    const handleCancel = () => {
        window.location.href = `/flash_cards`;
    };

    const handleCardClick = (index: number) => {
        setFlippedIndex(index === flippedIndex ? null : index);
    };

    const handleDelete = async (card: Flashcard) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/flashcards/flashcards/${card.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                window.location.reload();
            } else {
                throw new Error("Failed to delete note");
            }
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const handleUnarchive = async (card:Flashcard) =>{
        try {
            const response = await fetch(`http://127.0.0.1:8000/flashcards/flashcards/${card.id}/`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        archived: false,
                    }),
                    headers: {
                        Accept: "application/json",
                        'Authorization': `${localStorage.getItem("token")}`,
                        "Content-Type":
                            "application/json;charset=UTF-8;multipart/form-data",
                    },
                });
            if (response.ok) {
                window.location.reload();
            } else {
                throw new Error("Failed to archive flashcard");
            }
        } catch (error) {
            console.error("Error archiving flashcard:", error);
        }
    }

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
                        <h1>Flashcardurile arhivate</h1>
                    </div>
                </header>
            </div>

            <div className="content-container">
                <div className="notes-container4">
                    {allFlashcards.map((card, index) => (
                        <div
                            key={index}
                            className={`note-cube card-type-${index % 8}`}
                        >
                            <div style={{ marginBottom: "10px" }}>
                                <div className="title">
                                    Front: {card.front}
                                </div>
                                <div className="topic">
                                    Back: {card.back}
                                </div>
                            </div>
                            <div>
                            <button className="trashcan-button" onClick={() => handleDelete(card)}> 🗑️
                                <span className="hover-text-archive">Șterge flashcardul</span>
                            </button>
                            <button className="pen" onClick={() => handleUnarchive(card)}>📥
                                <span className="hover-text-pen">Dezarhivează flashcardul</span>
                            </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ArchivedCards;