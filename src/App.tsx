import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Register_Login/Register";
import StartPage from "./Register_Login/StartPage";
import Login from "./Register_Login/Login";
import WelcomePage from "./inside_pages/WelcomePage";
import Logout from "./Register_Login/Logout";
import Notes from "./inside_pages/Notes";
import AllFlashCards from "./inside_pages/Flashcards-pages/AllFlashCards";
import AddNote from "./inside_pages/AddNote";
import UpdateNote from "./inside_pages/UpdateNote";
import DetailsNote from "./inside_pages/DetailsNote";
import MainFlashCardsPage from "./inside_pages/Flashcards-pages/MainFlashCardsPage";
import DisplayAllCriteria from "./inside_pages/Flashcards-pages/DisplayAllCriteria";
import DisplayAllDomains from "./inside_pages/Flashcards-pages/DisplayAllDomains";
import CardsOnDetail from "./inside_pages/Flashcards-pages/CardsOnDomain";
import CardsOnDomain from "./inside_pages/Flashcards-pages/CardsOnDomain";
import CardsOnCriteria from "./inside_pages/Flashcards-pages/CardsOnCriteria";
import ArchivedCards from "./inside_pages/Flashcards-pages/ArchivedCards";
import AddFlashcards from "./inside_pages/Flashcards-pages/AddFlashcards";
import AddCriteria from "./inside_pages/Flashcards-pages/AddCriteria";
import AddDomain from "./inside_pages/Flashcards-pages/AddDomain";
import UpdateFlashcard from "./inside_pages/Flashcards-pages/UpdateFlashcard";
import Chatbot from "./inside_pages/Chatbot";
import OldQuestions from "./inside_pages/OldQuestions";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [id, setUserId] = useState(0);
    const [token, setToken] = useState("");

    return (
        <div className="App">
            <Router> {/* Wrap Routes with Router */}
                <Routes>
                    <Route
                        path="/"
                        element={
                            <StartPage
                                email={email}
                                loggedIn={loggedIn}
                                setLoggedIn={setLoggedIn}
                            />
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <Register setLoggedIn={setLoggedIn} setEmail={setEmail} />
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <Login setLoggedIn={setLoggedIn} setEmail={setEmail} setToken={setToken}/>
                        }
                    />
                    <Route
                        path="/welcome"
                        element={<WelcomePage setToken={setToken} setUserId={setUserId}></WelcomePage>}
                    />

                    <Route path="/logout" element={<Logout></Logout>} />
                    <Route path="/notes/*" element={<Notes></Notes>} />

                    <Route path="/flash_cards/*" element={<MainFlashCardsPage></MainFlashCardsPage>} />
                    <Route path="/flash_cards/all-cards" element={<AllFlashCards></AllFlashCards>} />
                    <Route path="/flash_cards/criteria" element={<DisplayAllCriteria></DisplayAllCriteria>} />
                    <Route path="/flash_cards/domain" element={<DisplayAllDomains></DisplayAllDomains>} />
                    <Route path="/flash_cards/domain/card" element={<CardsOnDomain  ></CardsOnDomain>} />
                    <Route path="/flash_cards/criteria/card" element={<CardsOnCriteria  ></CardsOnCriteria>} />
                    <Route path="/flash_cards/archive" element={<ArchivedCards> </ArchivedCards>}/>
                    <Route path="/flash_cards/add_card" element={<AddFlashcards />} />
                    <Route path="/flash_cards/add_criteria" element={<AddCriteria />} />
                    <Route path="/flash_cards/add_domain" element={<AddDomain />} />
                    <Route path="/flash_cards/update_card" element={<UpdateFlashcard></UpdateFlashcard>} />


                    <Route path="/add-note" element={<AddNote></AddNote>} />
                    <Route path="/details-note" element={<DetailsNote></DetailsNote>}/>
                    <Route path="/update-note" element={<UpdateNote></UpdateNote>}/>
                    <Route path="/chat-bot" element={<Chatbot></Chatbot>}/>
                    <Route path="/old-questions" element={<OldQuestions></OldQuestions>}/>


                </Routes>
            </Router>
        </div>
    );
}

export default App;
