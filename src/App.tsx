import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Register_Login/Register";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState("");

    return (
        <div className="App">
            <Router> {/* Wrap Routes with Router */}
                <Routes>
                    <Route
                        path="/"
                    />
                    <Route
                        path="/signup"
                        element={
                            <Register setLoggedIn={setLoggedIn} setEmail={setEmail} />
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
