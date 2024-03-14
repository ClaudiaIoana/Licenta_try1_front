import {useState} from "react";
import { useNavigate } from "react-router-dom";
import './register.css';


const Register = (props: any) => {
    const [username, setUsername] = useState("");
    const [username_error, setUsernameError] = useState("");
    const [email, setEmail] = useState("");
    const [email_error, setEmailError] = useState("");
    const [password1, setPassword1] = useState("");
    const [password1_error, setPassword1Error] = useState("");
    const [password2, setPassword2] = useState("");
    const [password2_error, setPassword2Error] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");

    const navigate = useNavigate();

    const handleCancel = () => {
        window.location.href = '/';
    }

    const addNewUser = async (event: {preventDefault: () => void}) => {
        console.log("in add new user");
        event.preventDefault();

        setUsernameError("");
        setEmailError("");
        setPassword1Error("");
        setPassword2Error("");

        if ("" === username){
            setUsernameError("Please enter a username. ");
        }

        if ("" === email){
            setUsernameError("Please enter an email. ");
        }

        if ("" === password1){
            setPassword1Error("Please enter a password. ");
        }

        if ("" === password2){
            setPassword2Error("Please enter the same password as the first one. ");
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError("Please enter a valid email");
        }
        console.log("in add new user66");

        if(password1.length < 7){
            setPassword1Error("The password has to have at least 7 characters. ");
        }

        if(password2.length < 7){
            setPassword2Error("The password has to have at least 7 characters. ");
        }

        console.log('here');

        try {
            fetch("http://127.0.0.1:8000/user/dj-rest-auth/registration/", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password1: password1,
                    password2: password2,
                    first_name: first_name,
                    last_name: last_name,
                }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    console.log(
                        JSON.stringify({
                            username: username,
                            email: email,
                            password1: password1,
                            password2: password2,
                            first_name: first_name,
                            last_name: last_name,
                            role: "regular",
                        })
                    );
                });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mainContainer">
            <div className="titleContainer">
                <div>Register Here</div>
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={first_name}
                    placeholder={"First Name"}
                    onChange={(ev)=>setFirstName(ev.target.value)}
                    className="inputField"
                />
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={last_name}
                    placeholder={"Last Name"}
                    onChange={(ev)=>setLastName(ev.target.value)}
                    className="inputField"
                />
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={username}
                    placeholder={"Username"}
                    onChange={(ev)=>setUsername(ev.target.value)}
                    className="inputField"
                />
                {username_error && <div className="error">{username_error}</div>}
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={email}
                    placeholder={"Email"}
                    onChange={(ev)=>setEmail(ev.target.value)}
                    className="inputField"
                />
                {email_error && <div className="error">{email_error}</div>}
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={password1}
                    placeholder={"Password"}
                    onChange={(ev)=>setPassword1(ev.target.value)}
                    className="inputField"
                />
                {password1_error && <div className="error">{password1_error}</div>}
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={password2}
                    placeholder={"Confirm Password"}
                    onChange={(ev)=>setPassword2(ev.target.value)}
                    className="inputField"
                />
                {password2_error && <div className="error">{password2_error}</div>}
            </div>
            <br />

            <div className="buttonContainer">
                <input
                    className="inputButton"
                    type="button"
                    onClick={addNewUser}
                    value={"Register"}
                />
            </div>

        </div>
    )

}

export default Register;
