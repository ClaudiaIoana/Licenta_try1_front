import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        fetch(
            `http://127.0.0.1:8000/user/dj-rest-auth/logout/`,{
                method:"POST",
            }
            );
        console.log("am trecut prin logout")

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userID");
        navigate("/");
        }, []);

    return null;
};

export default Logout;
