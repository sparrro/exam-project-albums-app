import "./AlbumLi.css";
import AlbumInterface from "../../interfaces/AlbumInterface";
import { useNavigate } from "react-router-dom";

function AlbumLi(album: AlbumInterface) {
    
    const navigate = useNavigate();
    
    return (
        <li>
            <h3 onClick={() => navigate(`/album/${album.albumId}`)}>{album.title}</h3>
            <h4>{album.artist}</h4>
        </li>
    )
}

export default AlbumLi;