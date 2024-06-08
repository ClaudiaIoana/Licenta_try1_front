import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Flashcard } from "../../models/Flashcard";
import allFlashCards from "./AllFlashCards";
import cornerImage from "C:\\LICENTA\\front_try2\\src\\images\\heart-img.png";

const CardsOnCriteria = (props: any) => {
    const [height, setHeight] = useState('initial');
    const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([]);
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [lengthCards, setLengthCards] = useState<number>(0);
    const frontEls = useRef<(HTMLDivElement | null)[]>([]);
    const backEls = useRef<(HTMLDivElement | null)[]>([]);
    const location = useLocation();
    const criteriaCards = location.state?.criteriaCards || {};
    const [flagedQuestions, setFlagedQuestions] = useState<Flashcard[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/flashcards/flashcards/?criteria=${criteriaCards.id}`,
                    {
                        headers: {
                            'Authorization': `${localStorage.getItem("token")}`
                        }
                    }
                );
                const data = await response.json();
                setAllFlashcards(data);
                setLengthCards(data.length);
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
        window.location.href = `/flash_cards/criteria`;
    };

    const handleCardClick = (index: number) => {
        setFlippedIndex(index === flippedIndex ? null : index);
    };

    const handleNext = () => {
        setCurrentIndex(currentIndex === allFlashcards.length - 1 ? 0 : currentIndex + 1);
    };

    const handlePrevious = () => {
        setCurrentIndex(currentIndex === 0 ? allFlashcards.length - 1 : currentIndex - 1);
    };

    const handleFlag = (card: Flashcard) => {
        const index2 = flagedQuestions.findIndex((q) => q.id === card.id);
        if (index2 !== -1) {
            const updatedList = [...flagedQuestions];
            updatedList.splice(index2, 1);
            setFlagedQuestions(updatedList);
        } else {
            setFlagedQuestions([...flagedQuestions, card]);
        }
    };

    const currentCard = allFlashcards.length > 0 ? allFlashcards[currentIndex] : null;

    return (
        <div>
            <div className="welcome-container">
                <img src={cornerImage} alt="Corner Image" className="corner-image-left3" />
                <section>
                    <div className="arrow-container" onClick={handleCancel}>
                        <button className="arrow-button">🔙</button>
                    </div>
                </section>
                <header className="header">
                    <div className="welcome-message">
                        <h1>{criteriaCards.name}</h1>
                    </div>
                </header>
            </div>

            <button className="flag-button" onClick={() => handleFlag(allFlashcards[currentIndex])}>🚩</button>
            <p style={{ fontSize: 25 }}> Flashcarduri neștiute: {flagedQuestions.length}</p>
            {flagedQuestions.some((q) => q.id === allFlashcards[currentIndex]?.id) && (
                <h3 style={{color:"darkred"}}>Acest flashcard a fost marcat ca neștiut!</h3>
            )}

            <div className="content-container">
                <div className="notes-container3">
                    <div
                        key={currentIndex}
                        className={`card ${currentIndex === flippedIndex ? 'flip' : ''}`}
                        style={{ height: height }}
                        onClick={() => handleCardClick(currentIndex)}
                    >

                        <div className="front" ref={(el) => frontEls.current[currentIndex] = el}>
                            {currentCard?.front}
                        </div>
                        <div className="back" ref={(el) => backEls.current[currentIndex] = el}>
                            {currentCard?.back}
                        </div>
                    </div>
                </div>

            </div>

            <div>
                <button onClick={handlePrevious} className="pagination-button">⬅️</button>
                <button onClick={handleNext} className="pagination-button">➡️</button>
            </div>
            <div>
                <p style={{ fontSize: 25 }}>{currentIndex + 1}/{lengthCards}</p>
            </div>
        </div>
    );
}

export default CardsOnCriteria;
