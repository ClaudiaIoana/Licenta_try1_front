import React from "react";
import { useNavigate } from "react-router-dom";
import './register.css';

const StartPage = (props: { loggedIn: any; email: any; setLoggedIn: any }) => {
    const { loggedIn, email } = props;
    const navigate = useNavigate();

    const onButtonClickLogIn = () => {
        if (loggedIn) {
            localStorage.removeItem("user");
            props.setLoggedIn(false);
        } else {
            navigate("/login");
        }
    };

    const onButtonClickSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className="mainContainer">
            <div className="titleContainer">Welcome to your learning environment</div>
                <div className="buttonsContainer">
                    <div className="textContainer">Are you already signed up? </div>
                    <input
                        className="signInButton"
                        type="button"
                        onClick={onButtonClickLogIn}
                        value={loggedIn ? "Log out" : "Log in"}
                    />
                    <div className="textContainer">Would you like to join our platform? </div>
                    <input
                        className="signInButton"
                        type="button"
                        onClick={onButtonClickSignUp}
                        value="Sign Up"
                    />
                {loggedIn && <div>Your username is {email}</div>}
            </div>
        </div>
    );
};

export default StartPage;

