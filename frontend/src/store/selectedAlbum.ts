import { create } from "zustand";
import AlbumInterface from "../interfaces/AlbumInterface";

interface SelectedAlbumState {
    selectedAlbum: AlbumInterface | null;
    setSelectedAlbum: (album: AlbumInterface) => void;
}

export const useSelectedAlbumStore = create<SelectedAlbumState>((set) => ({
    selectedAlbum: null,
    setSelectedAlbum: (album) => set({selectedAlbum: album}),
}));