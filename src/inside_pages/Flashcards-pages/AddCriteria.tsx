import React, { useState, useEffect } from "react";
import {Link, Routes} from "react-router-dom";

const AddCriteria = () => {
    let [error, setError] = useState<string | null>(null);
    const [isCriteriaAdded, setIsCriteriaAdded] = useState(false);


    const [criteriaData, setCriteriaData] = useState({
        name : "",
        details: "",
    });


    const addCriteria = () => {
        console.log("for now");
    }

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log(name, value);
        setCriteriaData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        window.location.href = `/flash_cards/criteria`;
    };

    const onSaveNewCriteria = async (event: { preventDefault: () => void }) =>{
        console.log('here')
        try{
            const response = await fetch("http://127.0.0.1:8000/flashcards/category/",
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: criteriaData.name,
                        details: criteriaData.details,
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
                setIsCriteriaAdded(true);
            }
        } catch (error) {
            console.log("blaaaaa")
            console.log(error)
            console.error(error);
            setError("An unexpected error occurred");
        }
        setTimeout(() => {
            window.location.href = `/flash_cards/criteria`;
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
                <form onSubmit={addCriteria}>
                    <label>
                        Nume:
                        <input
                            type="string"
                            name="name"
                            value={criteriaData.name}
                            onChange={handleDataChange}
                        />
                    </label>
                    <label>
                        Detalii:
                        <textarea
                            name="details"
                            value={criteriaData.details}
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
                    onClick={onSaveNewCriteria}
                    value={"Adaugă categoria"}
                />

            </div>
        </div>


    );

}
export default AddCriteria;