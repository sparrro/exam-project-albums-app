import { create } from "zustand";
import TagsInterface from "../interfaces/TagsInterface";

interface TagsState {
    tags: TagsInterface[] | null;
    setTags: (tags: TagsInterface[]) => void;
}

export const useTagsStore = create<TagsState>((set) => ({
    tags: null,
    setTags: (tags) => set({tags: tags}),
}));