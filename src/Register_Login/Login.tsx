import React, { CSSProperties, useState } from "react";
import { useNavigate } from "react-router-dom";
import cornerImage from "C:\\LICENTA\\front_try2\\src\\images\\masina-de-salvare.gif";


const Login = (props: any) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [rightCredentials, setRightCredentials] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const onButtonClick = () => {
        setUsernameError("");
        setPasswordError("");

        if ("" === username) {
            setUsernameError("Please enter your username");
            return;
        }

        if ("" === username) {
            setUsernameError("Please enter a valid username");
            return;
        }

        if ("" === password) {
            setPasswordError("Please enter a password");
            return;
        }

        if (password.length < 7) {
            setPasswordError("The password must be 8 characters or longer");
            return;
        }

        try {
            fetch("http://127.0.0.1:8000/user/dj-rest-auth/login/", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    const token = data.key;
                    localStorage.setItem("token", token);

                    const username = data.username;
                    localStorage.setItem("username", username);

                    const userID = data.id;
                    localStorage.setItem("userID", userID);

                    console.log(data.non_field_errors);

                    if (
                        data.non_field_errors &&
                        data.non_field_errors[0] ==
                        "Unable to log in with provided credentials."
                    ) {
                        setRightCredentials(false);
                    } else {
                        setTimeout(() => {
                            navigate("/welcome");
                        }, 500);
                        setRightCredentials(true);
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = () => {
        window.location.href = `/`;
    };

    return (
        <div className="bodyCustom">
            <img src={cornerImage} alt="Corner Image" className="corner-image-left-ambulanta"/>
            <section>
                <div className="arrow-container" onClick={handleCancel}>
                    <button className="arrow-button">🔙</button>
                </div>
            </section>
        <div className="mainContainer">
            <div className="titleContainer">
                <div>Conectare</div>
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={username}
                    placeholder="Username"
                    onChange={(ev) => setUsername(ev.target.value)}
                    className="inputField"
                />
                <label className="error">{usernameError}</label>
            </div>
            <br />
            <div className="inputContainer">
                <div className="inputContainer">
                    <input
                        value={password}
                        placeholder="Parolă"
                        onChange={(ev) => setPassword(ev.target.value)}
                        className="inputField"
                        type={showPassword ? "text" : "password"}
                    />
                    <button
                        className="eyeButton"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "🩺" : "🩺"}
                    </button>
                </div>
                <label className="error">{passwordError}</label>
            </div>
            <br />
            <div className="inputContainer">
                <input
                    className="inputButton"
                    type="button"
                    onClick={onButtonClick}
                    value={"Conectare"}
                />
                {!rightCredentials && <div>Credențialele sunt incorecte.</div>}
            </div>
        </div>
        </div>
    );
};

export default Login;
