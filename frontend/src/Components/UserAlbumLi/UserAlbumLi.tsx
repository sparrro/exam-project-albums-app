import TagsInterface from "../../interfaces/TagsInterface";
import "./UserAlbumLi.css";

export default function UserAlbumLi(album: TagsInterface) {
    return(
        <li>
            <h3 onClick={album.onClick}>{album.title}</h3>
        </li>
    )
}