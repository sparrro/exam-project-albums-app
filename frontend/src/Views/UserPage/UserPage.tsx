import { useEffect } from "react";
import "./UserPage.css"
import { useLoginStore } from "../../store/login";
import { apiGetUser } from "../../api/accountCalls";
import { apiGetAlbum } from "../../api/albumCalls";
import UserAlbumLi from "../../Components/UserAlbumLi/UserAlbumLi";
import { useSelectedAlbumStore } from "../../store/selectedAlbum";
import UserAlbumCard from "../../Components/UserAlbumCard/UserAlbumCard";
import { useTagsStore } from "../../store/tags";

function UserPage() {

    const { token } = useLoginStore();

    const { tags, setTags } = useTagsStore();

    const { selectedAlbum, setSelectedAlbum } = useSelectedAlbumStore();

    const getUserData = async () => {
        const response = await apiGetUser(token);
        setTags(response.data);
        console.log(response.data);
        return response.data;
    }

    const getAlbumData = async (albumId: string) => {
        const response = await apiGetAlbum(albumId);
        setSelectedAlbum(response.data);
        console.log(response.data);
    }

    useEffect(() => {
        getUserData().then((res) => {
            getAlbumData(res[Math.floor(Math.random()*res.length)].albumId)
        })
    }, []);

    return (
        <div className="content-centerer">
            <section className="my-albums">
                <h2>My albums</h2>
                {tags?.map(album => <UserAlbumLi
                    {...album}
                    onClick={() => getAlbumData(album.albumId)}
                    key={album.albumId}/>)}
            </section>
            {selectedAlbum && <UserAlbumCard/>}
        </div>
    )
}

export default UserPage;