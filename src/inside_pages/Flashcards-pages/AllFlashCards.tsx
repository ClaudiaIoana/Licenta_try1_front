import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Flashcard } from "../../models/Flashcard";

const AllFlashCards = (props: any) => {
    const [height, setHeight] = useState('initial');
    const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([]);
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null); // Track index of the currently flipped card

    const frontEls = useRef<(HTMLDivElement | null)[]>([]);
    const backEls = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/flashcards/flashcards/`,
                    {
                        headers: {
                            'Authorization': `${localStorage.getItem("token")}` // Assuming you're using Token-based authentication
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
    }, []); // Run this effect only once after initial render

    const handleCancel = () => {
        window.location.href = `/welcome`;
    };

    const handleCardClick = (index: number) => {
        setFlippedIndex(index === flippedIndex ? null : index); // Toggle flip state
    };

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
                        <h1>Carduri flashcard</h1>
                    </div>
                </header>
            </div>

            <div className="content-container">
                <div className="notes-container2">
                    {allFlashcards.map((card, index) => (
                        <div
                            key={index}
                            className={`card ${index === flippedIndex ? 'flip' : ''}`}
                            style={{ height: height }}
                            onClick={() => handleCardClick(index)}
                        >
                            <div className="front" ref={(el) => frontEls.current[index] = el}>
                                {card.front}
                            </div>
                            <div className="back" ref={(el) => backEls.current[index] = el}>
                                {card.back}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllFlashCards;
