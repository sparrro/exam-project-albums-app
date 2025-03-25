import { create } from "zustand";
import AlbumInterface from "../interfaces/AlbumInterface";

interface AlbumState {
    albums: AlbumInterface[];
    setAlbums: (searchResults: AlbumInterface[]) => void;
}

export const useAlbumState = create<AlbumState>((set) => ({
    albums: [],
    setAlbums: (searchResults) => set({albums: searchResults}),
}));