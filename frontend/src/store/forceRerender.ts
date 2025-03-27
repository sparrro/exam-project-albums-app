//use to reset input lists
//give the list component rerenderKey as key
//call forceRerender to reset it

import { create } from "zustand";

interface ForceRerenderState {
    rerenderKey: number;
    forceRerender: () => void;
}

export const useForceRerenderStore = create<ForceRerenderState>((set) => ({
    rerenderKey: 0,
    forceRerender: () => set((state) => ({
        rerenderKey: state.rerenderKey + 1
    }))
}));