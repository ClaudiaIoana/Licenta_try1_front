import React, { useState, useEffect, useRef } from "react";
import {Link, useLocation} from "react-router-dom";
import { Flashcard } from "../../models/Flashcard";
import allFlashCards from "./AllFlashCards";


const CardsOnCriteria = (props: any) => {
    const [height, setHeight] = useState('initial');
    const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([]);
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);


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
                console.log(data);
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
        console.log(allFlashcards);
        const index2 = flagedQuestions.findIndex((q) => q.id === card.id);
        if (index2 !== -1) {
            const updatedList = [...flagedQuestions];
            updatedList.splice(index2, 1);
            setFlagedQuestions(updatedList);
        } else {
            setFlagedQuestions([...flagedQuestions, card]);
        }
    };

    console.log(flagedQuestions)


    const currentCard = allFlashcards.length > 0 ? allFlashcards[currentIndex] : null;


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
                        <h1>Criteriu de testare: {criteriaCards.name}</h1>
                    </div>
                </header>
            </div>

            <div className="content-container">
                <div className="notes-container3">
                    <button className="trashcan-button" onClick={() => handleFlag(allFlashcards[currentIndex])}>🚩</button>

                    <div
                        key={currentIndex}
                        className={`card ${currentIndex === flippedIndex ? 'flip' : ''}`}
                        style={{ height: height }}
                        onClick={() => handleCardClick(currentIndex)}
                    >


                        <div className="front" ref={(el) => frontEls.current[currentIndex] = el}>
                            {currentCard?.front}
                            {flagedQuestions.some((q) => q.id === allFlashcards[currentIndex]?.id) && (
                                <div className="flag-message">Marcat</div>
                            )}
                        </div>
                        <div className="back" ref={(el) => backEls.current[currentIndex] = el}>
                            {currentCard?.back}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <p>{currentIndex+1}</p>
            </div>
            <div>
                <button onClick={handlePrevious}>Prev</button>
                <button onClick={handleNext}>Next</button>
            </div>
        </div>
    );
}

export default CardsOnCriteria