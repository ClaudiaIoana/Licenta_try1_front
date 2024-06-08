import React from "react";
import { useNavigate } from "react-router-dom";
import cornerImage from "C:\\LICENTA\\front_try2\\src\\images\\1000014799__3212_2140_-removebg.png";


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
            <img src={cornerImage} alt="Corner Image" className="corner-image-center" />

            <div className="titleContainer">Bun venit pe platforma ta de învățare</div>
                <div className="buttonsContainer">
                    <div className="textContainer">Ai deja un cont? </div>
                    <input
                        className="signInButton"
                        type="button"
                        onClick={onButtonClickLogIn}
                        value={loggedIn ? "Deconectare" : "Conectare"}
                    />
                    <div className="textContainer">Vrei să îți creezi un cont? </div>
                    <input
                        className="signInButton"
                        type="button"
                        onClick={onButtonClickSignUp}
                        value="Înregistrează-te"
                    />
                {loggedIn && <div>Your username is {email}</div>}
            </div>
        </div>
    );
};

export default StartPage;

