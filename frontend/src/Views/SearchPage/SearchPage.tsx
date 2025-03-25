import AlbumList from "../../Components/AlbumList/AlbumList";
import { useAlbumState } from "../../store/albums";
import "./SearchPage.css"
import InputFieldList from "../../Components/InputFieldList/InputFieldList";
import ActionButton from "../../Components/ActionButton/ActionButton";
import { apiTagSearch, apiTitleSearch } from "../../api/albumCalls";

function SearchPage() {

    const { setAlbums } = useAlbumState();

    const handleTitleSearch = async () => {
        const title = (document.getElementById("title-input") as HTMLInputElement).value;

        const response = await apiTitleSearch(title);

        if (response.success) {
            setAlbums(response.data);
        } else {
            console.log(response.message);
        }

    }

    const handleTagSearch = async () => {
        const inputEls = document.querySelectorAll("li>input") as NodeListOf<HTMLInputElement>;
        const tags = Array.from(inputEls).map(inputEl => inputEl.value);

        const response = await apiTagSearch(tags);

        if (response.success) {
            setAlbums(response.data);
        } else {
            console.log(response.message);
        }
    }

    return (
        <div className="content-centerer">
            <section className="search-params">
                <h2>Enter an album:</h2>
                <input type="text" id="title-input" />
                <ActionButton prompt="Search" clickFunction={handleTitleSearch}/>
                <h2>Or search by tags:</h2>
                <InputFieldList/>
                <ActionButton prompt="Search" clickFunction={handleTagSearch}/>
            </section>
            <AlbumList/>
        </div>
    )
}

export default SearchPage;