import { useEffect, useState } from "react";
import { useSelectedAlbumStore } from "../../store/selectedAlbum";
import { useTagsStore } from "../../store/tags";
import InputFieldList from "../InputFieldList/InputFieldList";
import "./UserAlbumCard.css";
import ActionButton from "../ActionButton/ActionButton";
import { useLoginStore } from "../../store/login";
import { apiEditTags, apiGetAlbum, apiRemoveAlbum } from "../../api/albumCalls";
import { apiGetUser } from "../../api/accountCalls";
import TagsInterface from "../../interfaces/TagsInterface";
import { useForceRerenderStore } from "../../store/forceRerender";

function UserAlbumCard() {

    const { selectedAlbum, setSelectedAlbum } = useSelectedAlbumStore();

    const { tags, setTags } = useTagsStore();

    const { token } = useLoginStore();

    const { currentTags, setCurrentTags } = useTagsStore();

    const { rerenderKey, forceRerender } = useForceRerenderStore();

    const [removedTags, setRemovedTags] = useState<string[]>([]);

    useEffect(() => {
        setCurrentTags(tags!.find((t) => t.albumId === selectedAlbum?.albumId)?.tags || []);
    }, []);

    useEffect(() => {
        setRemovedTags([]);
    }, [selectedAlbum]);

    const handleToggleTag = (tag: string) => {
        if (removedTags.includes(tag)) {
            setRemovedTags(removedTags.filter(entry => entry !== tag));
        } else {
            setRemovedTags([...removedTags, tag]);
        }
    }

    const handleEditTags = () => {
        const addedTags = [...document.querySelectorAll("input")].map(inputEl => inputEl.value)
        .filter(tag => tag !== "" || null || undefined);
        setRemovedTags(removedTags.filter(tag => tag !== "" || null || undefined))
        apiEditTags(selectedAlbum!.albumId, token, addedTags, removedTags)
        .then(async () => {
            const response = await apiGetUser(token);
            setTags(response.data);
            setCurrentTags(response.data!.find((t: TagsInterface) => t.albumId === selectedAlbum!.albumId)!.tags);
            setRemovedTags([]);
            forceRerender();
        });
    }

    const handleRemoveAlbum = () => {
        apiRemoveAlbum(selectedAlbum!.albumId, token)
        .then(() => {
            setTags(tags!.filter(tag => tag.albumId !== selectedAlbum!.albumId));
            //hämta en ny slumpad skiva som selectedAlbum
            apiGetAlbum(tags![Math.floor(Math.random()*tags!.length)].albumId).
            then((res) => {
                setSelectedAlbum(res.data);
                setCurrentTags(tags!.find((t) => t.albumId === res.data!.albumId)!.tags);
            })
        });

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
                        <button onClick={() => handleToggleTag(tag)}>{removedTags.includes(tag) ? "Put it back" : "Remove"}</button>
                    </li>
                ))}
            </ul>
            <InputFieldList key={rerenderKey} />
            <ActionButton prompt="Edit tags" clickFunction={handleEditTags}/>
            <ActionButton prompt="Remove album from my library" clickFunction={handleRemoveAlbum}/>
        </section>
    )
}

export default UserAlbumCard;