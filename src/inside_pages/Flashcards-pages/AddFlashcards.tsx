import React, { useState, useEffect } from "react";
import {Link, Routes} from "react-router-dom";


const AddFlashcards = () => {
    let [error, setError] = useState<string | null>(null);
    const [isCardAdded, setIsCardAdded] = useState(false);


    const [cardData, setCardData] = useState({
        front : "",
        back: "",
    });


    const addCard = () => {
        console.log("for now");
    }

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log(name, value);
        setCardData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        window.location.href = `/flash_cards/all-cards`;
    };

    const onSaveNewCard = async (event: { preventDefault: () => void }) =>{
        console.log('here')
        try{
            const response = await fetch("http://127.0.0.1:8000/flashcards/flashcards/",
                {
                    method: "POST",
                    body: JSON.stringify({
                        front: cardData.front,
                        back: cardData.back,
                        creator: localStorage.getItem("userID"),
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
                setIsCardAdded(true);
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
                    <button className="add-button">&#8592;</button>
                </div>
            </section>
            <div className="add-note-container">
                <form onSubmit={addCard}>
                    <label>
                        Front:
                        <input
                            type="string"
                            name="front"
                            value={cardData.front}
                            onChange={handleDataChange}
                        />
                    </label>
                    <label>
                        Back:
                        <textarea
                            name="back"
                            value={cardData.back}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                handleDataChange(e)
                            }
                            rows={10}
                        />
                    </label>
                </form>
                <input
                    className="add-note-button"
                    type="button"
                    onClick={onSaveNewCard}
                    value={"Add card"}
                />

            </div>
        </div>


    );

}

export default AddFlashcards;