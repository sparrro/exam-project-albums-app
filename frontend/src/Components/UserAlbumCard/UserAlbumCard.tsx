import { useState } from "react";
import { useSelectedAlbumStore } from "../../store/selectedAlbum";
import { useTagsStore } from "../../store/tags";
import InputFieldList from "../InputFieldList/InputFieldList";
import "./UserAlbumCard.css";

export default function UserAlbumCard() {

    const { selectedAlbum } = useSelectedAlbumStore();

    const { tags } = useTagsStore();

    const currentTags = tags!.find((t) => t.albumId === selectedAlbum?.albumId)?.tags || [];

    const [removedTags, setRemovedTags] = useState<string[]>([]);

    const handleToggleTag = (tag: string) => {
        console.log(removedTags)
        setRemovedTags((prev) => 
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
        console.log(removedTags);
    }

    return(
        <section className="user-selected-album">
            <h2>{selectedAlbum?.title}</h2>
            <h3>{selectedAlbum?.artist}</h3>
            <p>My tags:</p>
            <ul>
                {currentTags.map(tag => (
                    <li key={tag}>
                        <p>{tag}</p>
                        <button onClick={() => handleToggleTag(tag)}>{removedTags.includes(tag) ? "+" : "-"}</button>
                    </li>
                ))}
            </ul>
            <InputFieldList/>

        </section>
    )
}