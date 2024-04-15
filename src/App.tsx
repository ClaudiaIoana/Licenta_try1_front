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
import FlashCards from "./inside_pages/FlashCards";
import AddNote from "./inside_pages/AddNote";
import UpdateNote from "./inside_pages/UpdateNote";
import DetailsNote from "./inside_pages/DetailsNote";

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
                    <Route path="/flash_cards/*" element={<FlashCards></FlashCards>} />
                    <Route path="/add-note" element={<AddNote></AddNote>} />
                    <Route path="/details-note" element={<DetailsNote></DetailsNote>}/>
                    <Route path="/update-note" element={<UpdateNote></UpdateNote>}/>

                </Routes>
            </Router>
        </div>
    );
}

export default App;
