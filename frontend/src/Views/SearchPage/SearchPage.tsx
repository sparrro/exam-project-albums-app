import AlbumList from "../../Components/AlbumList/AlbumList";
import { useAlbumState } from "../../store/albums";
import "./SearchPage.css"
import InputFieldList from "../../Components/InputFieldList/InputFieldList";
import ActionButton from "../../Components/ActionButton/ActionButton";
import { apiTagSearch, apiTitleSearch } from "../../api/albumCalls";
import { useForceRerenderStore } from "../../store/forceRerender";
import { useEffect } from "react";

function SearchPage() {

    const { setAlbums } = useAlbumState();

    const { rerenderKey, forceRerender } = useForceRerenderStore();

    useEffect(() => {
        setAlbums([]);
    }, []);

    const handleTitleSearch = () => {
        const title = (document.getElementById("title-input") as HTMLInputElement).value;

        apiTitleSearch(title)
        .then((res) => {
            if (res.success) {
                setAlbums(res.data);
            }
    
            forceRerender();
        });
    }

    const handleTagSearch = () => {
        const inputEls = document.querySelectorAll("li>input") as NodeListOf<HTMLInputElement>;
        const tags = [...inputEls].map(inputEl => inputEl.value).filter(value => value !== "");

        apiTagSearch(tags)
        .then((res) => {
            if (res.success) {
                setAlbums(res.data);
            }
        });
    }

    return (
        <div className="content-centerer">
            <section className="search-params">
                <h2>Enter an album:</h2>
                <input type="text" id="title-input" />
                <ActionButton prompt="Search" clickFunction={handleTitleSearch}/>
                <h2>Or search by tags:</h2>
                <InputFieldList key={rerenderKey} />
                <ActionButton prompt="Search" clickFunction={handleTagSearch}/>
            </section>
            <AlbumList/>
        </div>
    )
}

export default SearchPage;