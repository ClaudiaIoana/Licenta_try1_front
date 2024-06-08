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

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
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
                        <h1>Toate flashcardurile</h1>
                    </div>
                </header>
            </div>

            <div className="add-note-section">
                <Link to="/flash_cards/add_card">
                    <button className="add-note-button">
                        <span className="plus-sign">+</span> Crează un flashcard
                    </button>
                </Link>
            </div>

            <div className="content-container">
                <div className="notes-container4">
                    {allFlashcards.map((card, index) => (
                        <div
                            key={index}
                            className={`note-cube card-type-${index % 8}`}
                            onClick={() => handleCardClick(index)}
                            style={{ '--card-height': 'auto' } as React.CSSProperties}
                        >
                            <div style={{ marginBottom: "10px" }}>
                                <div className="title" ref={(el) => frontEls.current[index] = el}>
                                    Față: {card.front}
                                </div>
                                <div className="topic" ref={(el) => backEls.current[index] = el}>
                                    Spate: {truncateText(card.back, 200)}
                                </div>
                            </div>
                            <div>
                                <button className="trashcan-button" onClick={() => handleArchive(card)}>📦
                                    <span className="hover-text-archive">Arhivează flashcardul</span>
                                </button>
                                <Link to="/flash_cards/update_card" state={{ noteDetail: card }} >
                                    <button  className="pen">
                                        ✏️
                                        <span className="hover-text-pen">Modifică flashcardul</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {error && <div>Error: {error}</div>}
        </div>
    );
};

export default AllFlashCards;
