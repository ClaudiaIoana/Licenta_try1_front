import React, { useState } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import "./the_css_file.css";
import AddNote from "./AddNote";
import {User} from "../models/User";
import cornerImage from "C:\\LICENTA\\front_try2\\src\\images\\cornerImg-removebg-preview.png";
import profilePicture from "C:\\LICENTA\\front_try2\\src\\images\\profile-pic.jpg";

const WelcomePage = (props: any) => {
    const navigate = useNavigate();
    const [showUserInfoPopup, setShowUserInfoPopup] = useState(false);
    const [userData, setUserData] = useState<User>()
    const [menuOpen, setMenuOpen] = useState(false);

    const onAddNotes = () => {
        navigate("/notes");
    }

    const onAddFlashCards = () => {
        navigate("/flash_cards");
    }

    const onMoveToChat = () => {
        navigate("/chat-bot");
    }

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setShowUserInfoPopup(!showUserInfoPopup);
    };

    const getUser = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/user/`,
                {
                    headers: {
                        'Authorization': `${localStorage.getItem("token")}`
                    }
                }
            );
            const data = await response.json();
            console.log(data);
            setUserData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const toggleUserInfoPopup = () => {
        getUser();
        setShowUserInfoPopup(!showUserInfoPopup);
    }

    return (
        <div className="page-container">
            <img src={cornerImage} alt="Corner Image" className="corner-image-left" />
            <div className="welcome-container">
                <header className="header">
                    <button className="user-icon" onClick={toggleUserInfoPopup}>
                        👤
                    </button>
                    {showUserInfoPopup && (
                    <div className="popup">
                        <div className="popup-inner">
                            <button className="exit-button-profile" onClick={toggleUserInfoPopup}>X</button>
                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    alt={`${userData?.username}'s profile`}
                                    className="profile-picture"
                                />
                            ) : (
                                <p>No profile picture available</p>
                            )}
                            <h3>User Name: </h3>
                            <p>{userData?.username}</p>
                            <h3>Email: </h3>
                            <p>{userData?.email}</p>
                            <h3>First Name: </h3>
                            <p>{userData?.first_name}</p>
                            <h3>Last Name: </h3>
                            <p>{userData?.last_name}</p>
                        </div>
                    </div>
                )}
                    <Link to="/logout" className="logout-button">Deconectare</Link>
                </header>
            </div>

            <div className="sections-container">
                <section className="section">
                    <h2 className="section-title">Notițe</h2>
                    <div className="button-container">
                        <button className="add-button2" onClick={onAddNotes}>🧠</button>
                        <span>Mergi la notițele tale.</span>
                    </div>
                </section>
                <section className="section">
                    <h2 className="section-title">Flashcarduri</h2>
                    <div className="button-container">
                        <button className="add-button2" onClick={onAddFlashCards}>
                            💉</button>
                        <span>Testează-ți cunoștințele folosind flashcarduri.</span>
                    </div>
                </section>
                <section className="section">
                    <h2 className="section-title">Chatbot</h2>
                    <div className="button-container">
                        <button className="add-button2" onClick={onMoveToChat}>🦠</button>
                        <span>Comunică cu chatbotul pentru a înțelege mai multe despre boli.</span>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default WelcomePage;
