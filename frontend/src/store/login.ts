import { create } from "zustand";

interface LoginState {
    username: string;
    token: string;
    setUsername: (username: string) => void;
    setToken: (token: string) => void;
    logOut: () => void;
}

export const useLoginStore = create<LoginState>((set) => ({
    username: "",
    token: "",
    setUsername: (username) => set({username: username}),
    setToken: (token) => set({token: token}),
    logOut: () => set({username: "", token: ""}),
}));