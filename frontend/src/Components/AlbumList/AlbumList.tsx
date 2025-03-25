import AlbumInterface from "../../interfaces/AlbumInterface";
import { useAlbumState } from "../../store/albums";
import AlbumLi from "../AlbumLi/AlbumLi";
import "./AlbumList.css";

function AlbumList() {

    const { albums } = useAlbumState();

    return (
        <section className="album-list">
            <h2>Matching Albums</h2>
            <ul>{albums.map((album: AlbumInterface) => (
                <AlbumLi {...album} key={album.albumId}/>
            ))}</ul>
        </section>
    )
}

export default AlbumList;