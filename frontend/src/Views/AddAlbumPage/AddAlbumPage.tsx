import { useState } from "react";
import { apiAddNewAlbum } from "../../api/albumCalls";
import ActionButton from "../../Components/ActionButton/ActionButton";
import InputFieldList from "../../Components/InputFieldList/InputFieldList";
import { useLoginStore } from "../../store/login";
import "./AddAlbumPage.css"
import { useForceRerenderStore } from "../../store/forceRerender";

function AddAlbumPage() {

    const { token } = useLoginStore();

    const { rerenderKey, forceRerender } = useForceRerenderStore();

    const [responseMsg, setResponseMsg] = useState("");

    const handleAdd = async () => {
        const titleEl = document.getElementById("title") as HTMLInputElement;
        const artistEl = document.getElementById("artist") as HTMLInputElement;
        const tagInputs = document.querySelectorAll(".tag-input-list input") as NodeListOf<HTMLInputElement>;
        const tags = [...tagInputs].map(input => input.value).filter(tag => tag !== "");

        const response = await apiAddNewAlbum(titleEl.value, artistEl.value, tags, token);
        console.log(titleEl.value, artistEl.value, tags)
        setResponseMsg(response.message);
        if (response.success) {
            titleEl.value = "";
            artistEl.value = "";
            forceRerender();
        }
    }

    return (
        <div className="content-centerer">
            <section className="album-adder-card">
                <h2>Add an album</h2>
                <label htmlFor="title">Title: </label>
                <input type="text" name="title" id="title" />
                <label htmlFor="artist">Artist/band: </label>
                <input type="text" name="artist" id="artist" />
                <label htmlFor="">Tags:</label>
                <InputFieldList key={rerenderKey}/>
                <p>{responseMsg}</p>
                <ActionButton prompt="Add album" clickFunction={handleAdd} />
            </section>
        </div>
    )
}

export default AddAlbumPage;