import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Flashcard } from "../../models/Flashcard";

const AllFlashCards = (props: any) => {
    const [height, setHeight] = useState('initial');
    const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([]);
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const frontEls = useRef<(HTMLDivElement | null)[]>([]);
    const backEls = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/flashcards/flashcards/`,
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
                setError("An unexpected error occurred while fetching data.");
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setMaxHeight();
        window.addEventListener('resize', setMaxHeight);
        return () => window.removeEventListener('resize', setMaxHeight);
    }, []); // Run this effect only once after initial render

    function setMaxHeight() {
        const maxHeight = frontEls.current.reduce((max, el, index) => {
            const frontHeight = el?.getBoundingClientRect().height || 0;
            const backHeight = backEls.current[index]?.getBoundingClientRect().height || 0;
            return Math.max(max, frontHeight, backHeight);
        }, 0);
        setHeight(`${maxHeight}px`);
    }

    const handleCancel = () => {
        window.location.href = `/flash_cards`;
    };

    const handleCardClick = (index: number) => {
        setFlippedIndex(index === flippedIndex ? null : index);
    };

    const handleArchive = async (card: Flashcard) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/flashcards/flashcards/${card.id}/`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        archived: true,
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
            setError("An unexpected error occurred while archiving the flashcard.");
        }
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
                        <h1>Toate flashcardurile</h1>
                    </div>
                </header>
            </div>

            <div className="add-note-section">
                <Link to="/flash_cards/add_card">
                    <button className="add-note-button">
                        <span className="plus-sign">+</span> Crează un nou flashcard
                    </button>
                </Link>
            </div>

            <div className="content-container">
                <div className="notes-container">
                    {allFlashcards.map((card, index) => (
                        <div
                            key={index}
                            className={`note-cube note-type-${index % 8}`}
                        >
                            <div style={{ marginBottom: "10px" }}>
                                <div className="title" ref={(el) => frontEls.current[index] = el}>
                                    Front: {card.front}
                                </div>
                                <div className="topic" ref={(el) => backEls.current[index] = el}>
                                    Back: {card.back}
                                </div>
                            </div>
                            <button className="trashcan-button" onClick={() => handleArchive(card)}>📦</button>
                        </div>
                    ))}
                </div>
            </div>
            {error && <div>Error: {error}</div>}
        </div>
    );
};

export default AllFlashCards;
