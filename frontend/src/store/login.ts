import { create } from "zustand";

interface LoginState {
    loggedIn: boolean;
    logIn: () => void;
    logOut: () => void;
}

export const useLoginStore = create<LoginState>((set) => ({
    loggedIn: false,
    logIn: () => set({loggedIn: true}),
    logOut: () => set({loggedIn: false}),
}));