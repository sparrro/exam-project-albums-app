const BASE_URL = "https://21cqrvlpfk.execute-api.eu-north-1.amazonaws.com"

export const apiSignUp = async (username: string, email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/account/signup`, {
        method: "post",
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data;
}

export const apiLogIn = async (username: string, password: string) => {
    const response = await fetch(`${BASE_URL}/account/login`, {
        method: "post",
        body: JSON.stringify({
            username: username,
            password: password,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data;
}