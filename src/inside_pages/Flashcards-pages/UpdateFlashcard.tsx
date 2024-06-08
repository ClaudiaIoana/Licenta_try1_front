import React, { useState, useEffect } from "react";
import {Link, Route, Routes, useLocation} from "react-router-dom";


const UpdateFlashcard = (props:any) =>{
    const location = useLocation();
    const cardDetail = location.state?.noteDetail || {};
    let [error, setError] = useState<string | null>(null);
    const [isNoteAdded, setIsNoteAdded] = useState(false);


    const [cardData, setCardData] = useState({
        front : cardDetail.front,
        back: cardDetail.back,
    });

    const addCard = () => {
        console.log("for now");
    }


    const MAX_CHARACTERS = 250;

    const handleDataChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (value.length <= MAX_CHARACTERS) {
            setCardData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            setError(`Maximum ${MAX_CHARACTERS} characters allowed`);
        }
    };
    const handleCancel = () => {
        window.location.href = `/flash_cards/all-cards`;
    };

    const onSaveNewCard = async (event: { preventDefault: () => void }) =>{
        try{
            const response = await fetch(`http://127.0.0.1:8000/flashcards/flashcards/${cardDetail.id}/`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        front: cardData.front,
                        back: cardData.back,
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
                setIsNoteAdded(true);
            }
        } catch (error) {
            console.log("blaaaaa")
            console.log(error)
            console.error(error);
            setError("An unexpected error occurred");
        }
        setTimeout(() => {
            window.location.href = `/flash_cards/all-cards`;
        }, 500);
    };

    return (
        <div>
            <section>
                <div className="arrow-container" onClick={handleCancel}>
                    <button className="arrow-button">🔙</button>
                </div>
            </section>
            <div className="add-note-container">
                <form onSubmit={addCard}>
                    <label>
                        Față:
                        <input
                            type="string"
                            name="front"
                            value={cardData.front}
                            onChange={handleDataChange}
                        />
                    </label>
                    <label>
                        Spate:
                        <textarea
                            name="back"
                            value={cardData.back}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                handleDataChange(e)
                            }
                            rows={20}
                        />
                    </label>
                </form>
                    <input
                        className="add-note-button"
                        type="button"
                        onClick={onSaveNewCard}
                        value={"Modifică flashcardul"}
                    />
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>


    );
}
export default UpdateFlashcard;