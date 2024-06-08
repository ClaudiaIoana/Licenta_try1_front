import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import {Link, useLocation} from "react-router-dom";
import cornerImage from "C:\\LICENTA\\front_try2\\src\\images\\download-removebg-preview.png";


const Chatbot: React.FC = () => {
    const location = useLocation();
    const noteDetail = location.state?.noteDetail || {};
    const [menuOpen, setMenuOpen] = useState(false);


    const [messages, setMessages] = useState([
        { sender: "bot", text: "Salut! Cu ce te pot ajuta azi?" }
    ]);
    const [userInput, setUserInput] = useState("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const sendMessage = async () => {
        if (userInput.trim() === "") return;

        const newMessages = [
            ...messages,
            {sender: "user", text: userInput}
        ];
        setMessages(newMessages);
        setUserInput("");

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/chatbot/ask/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        question: userInput,
                        creator: localStorage.getItem("userID"),
                    }),
                    headers: {
                        Accept: "application/json",
                        'Authorization': `${localStorage.getItem("token")}`,
                        "Content-Type":
                            "application/json;charset=UTF-8;multipart/form-data",
                    },
                }
            );
            const data = await response.json();
            console.log(data);
            setMessages((prevMessages) => [
                ...prevMessages,
                {sender: "bot", text: `${data['Response']}`}
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleCancel = () => {
        window.location.href = `/welcome`;
    };

    return (
        <div>
            <section>
                <div className="arrow-container" onClick={handleCancel}>
                    <button className="arrow-button">🔙</button>
                </div>
            </section>


                <Link to="/old-questions" className="logout-button">Vizualizează vechile întrebări</Link>
            <div className="chat-container">
                <img src={cornerImage} alt="Corner Image" className="corner-image-left3" />

                <div className="chat-window" id="chat-window">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-message ${msg.sender}`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="chat-input-container">
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Ce întrebare ai?"
                    />
                    <button onClick={sendMessage} className="button-send-chat">Trimite</button>
                </div>
            </div>

        </div>

    );
};

export default Chatbot;
