import React, { useState, useEffect } from "react";
import {Link, Routes} from "react-router-dom";

const AddDomain = () => {
    let [error, setError] = useState<string | null>(null);
    const [isDomainAdded, setIsDomainAdded] = useState(false);


    const [domainData, setDomainData] = useState({
        name : "",
        details: "",
    });


    const addDomain = () => {
        console.log("for now");
    }

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log(name, value);
        setDomainData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        window.location.href = `/flash_cards/domain`;
    };

    const onSaveNewDomain = async (event: { preventDefault: () => void }) =>{
        console.log('here')
        try{
            const response = await fetch("http://127.0.0.1:8000/flashcards/domains/",
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: domainData.name,
                        details: domainData.details,
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
                setIsDomainAdded(true);
            }
        } catch (error) {
            console.log("blaaaaa")
            console.log(error)
            console.error(error);
            setError("An unexpected error occurred");
        }
        setTimeout(() => {
            window.location.href = `/flash_cards/domain`;
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
                <form onSubmit={addDomain}>
                    <label>
                        Name:
                        <input
                            type="string"
                            name="name"
                            value={domainData.name}
                            onChange={handleDataChange}
                        />
                    </label>
                    <label>
                        Detials:
                        <textarea
                            name="details"
                            value={domainData.details}
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
                    onClick={onSaveNewDomain}
                    value={"Add domeniu"}
                />

            </div>
        </div>


    );

}
export default AddDomain;