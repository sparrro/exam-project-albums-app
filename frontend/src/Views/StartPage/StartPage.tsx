import { useState } from "react";
import "./StartPage.css";
import { apiSignUp, apiLogIn } from "../../api/accountCalls";
import { useLoginStore } from "../../store/login";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/music-album-svgrepo-com.svg";
import ActionButton from "../../Components/ActionButton/ActionButton";

function StartPage() {

    const { setUsername, setToken } = useLoginStore();

    const [mode, setMode] = useState("signup");

    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        const username = (document.getElementById("username-input") as HTMLInputElement).value;
        const password = (document.getElementById("password-input") as HTMLInputElement).value;
        
        const response = await apiLogIn(username, password);

        if (response.success) {
            setErrorMsg("");
            setToken(response.data.token);
            setUsername(username);
            navigate(`/user/${username}`);
        } else {
            setErrorMsg(response.message);
        }
    }

    const handleSignUp = async () => {
        const username = (document.getElementById("username-input") as HTMLInputElement).value;
        const email = (document.getElementById("email-input") as HTMLInputElement).value;
        const password = (document.getElementById("password-input") as HTMLInputElement).value;
        
        const response = await apiSignUp(username, email, password);

        if (response.success) {
            setErrorMsg("");
            handleLogin();
        } else {
            setErrorMsg(response.message);
        }
    }

    const handleSignInMode = () => {
        setMode("signin");
        document.querySelector(".mode-btn:first-child")?.classList.remove("active");
        document.querySelector(".mode-btn:nth-child(2)")?.classList.add("active");
        setErrorMsg("");
        (document.getElementById("username-input") as HTMLInputElement).value = "";
        (document.getElementById("password-input") as HTMLInputElement).value = "";
    }

    const handleSignUpMode = () => {
        setMode("signup");
        document.querySelector(".mode-btn:first-child")?.classList.add("active");
        document.querySelector(".mode-btn:nth-child(2)")?.classList.remove("active");
        (document.getElementById("username-input") as HTMLInputElement).value = "";
        (document.getElementById("password-input") as HTMLInputElement).value = "";
        setErrorMsg("");
    }
    
    return (
        <div className="content-centerer">
            <img src={logo} alt="" />
            <section className="login-box">
                <button className="mode-btn active" onClick={handleSignUpMode}>Sign up</button>
                <button className="mode-btn" onClick={handleSignInMode}>Sign in</button>
                <form>
                    <label htmlFor="username-input">Username:</label>
                    <input type="text" name="username-input" id="username-input" />
                    { mode === "signup" &&
                        <>
                            <label htmlFor="email-input">Email:</label>
                            <input type="text" name="email-input" id="email-input" />
                        </>
                    }
                    <label htmlFor="password-input">Password:</label>
                    <input type="password" name="password-input" id="password-input" />
                </form>
                {errorMsg != "" && <p>{errorMsg}</p>}
                <ActionButton clickFunction={ mode === "signup" ? handleSignUp : handleLogin } prompt={ mode === "signup" ? "Sign up" : "Sign in" } />
            </section>
        </div>
    )
}

export default StartPage;