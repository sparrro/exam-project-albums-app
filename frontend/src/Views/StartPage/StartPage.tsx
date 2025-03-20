import { useState } from "react"
import "./StartPage.css"

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

    const [mode, setMode] = useState("signup");

    const signUp = () => {
        console.log('succesfully signed up')
    }
    
    const logIn = () => {
        console.log("succesfully logged in")
    }
    
    const switchMode = () => {
        if (mode == "signup") {
            setMode("login")
        } else {
            setMode("signup")
        }
    }

    return (
        <>
            <button onClick={switchMode}>{mode == "signup" ? "Already have an account" : "Create an account"}</button>
            <button onClick={mode == "signup" ? signUp : logIn}>{mode == "signup" ? "Sign up" : "Log in"}</button>
        </>
    )
}

export default StartPage;