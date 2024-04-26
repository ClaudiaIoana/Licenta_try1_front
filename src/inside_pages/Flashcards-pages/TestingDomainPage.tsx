import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Flashcard } from "../../models/Flashcard";
import {Criteria} from "../../models/Criteria";

const TestingDomainPage = (props: any) => {
    const [height, setHeight] = useState('initial');
    const [allCriteria, setAllCriteria] = useState<Criteria[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/flashcards/domains/`,
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

            <div className="content-container">
                <div className="notes-container2">
                    <ul>
                        {allCriteria.map((criteria, index) => (
                            <li key={index}>
                                <Link to="/flash_cards/domain/card" state={{ criteriaCards: criteria }}>{criteria.name}</Link>
                                <ul>
                                    <li>{criteria.details}</li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TestingDomainPage;
