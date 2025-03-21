import { useState } from "react"
import "./StartPage.css"
import { apiSignUp, apiLogIn } from "../../api/accountCalls";
import { useLoginStore } from "../../store/login";

/*
knapp för att byta mellan registrering och inloggning
centrerat kort
-formulär med användarnamn mejl och lösenord
-knappar för att logga in eller registrera sig
--logga in
--registrera sig
aside
-knapp till söksidan
-knapp till alla skivorsidan
*/



function StartPage() {

    const { logIn } = useLoginStore();

    const [mode, setMode] = useState("signup");

    const handleSignUp = async () => {
        const username = (document.getElementById("username-input") as HTMLInputElement).value;
        const email = (document.getElementById("email-input") as HTMLInputElement).value;
        const password = (document.getElementById("password-input") as HTMLInputElement).value;
        
        await apiSignUp(username, email, password);
    }
    
    const handleLogIn = async () => {
        const username = (document.getElementById("username-input") as HTMLInputElement).value;
        const password = (document.getElementById("password-input") as HTMLInputElement).value;
        
        const response = await apiLogIn(username, password);
        console.log(response.data.token)
        sessionStorage.setItem("token", JSON.stringify(response.data.token));
        logIn();
    }

    return (
        <>
            <section className={mode === "signup" ? "signup-mode" : "signin-mode"}>
                <button className="mode-btn" onClick={() => setMode("signup")}>Sign up</button>
                <button className="mode-btn" onClick={() => setMode("login")}>Sign in</button>
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
                    <input type="text" name="password-input" id="password-input" />
                </form>
                <button onClick={mode === "signup" ? handleSignUp : handleLogIn }>{mode === "signup" ? "Sign up" : "Sign in"}</button>
            </section>
        </>
    )
}

export default StartPage;