import { useEffect } from "react";
import "./UserPage.css"
import { useLoginStore } from "../../store/login";
import { apiGetUser } from "../../api/accountCalls";
import { apiGetAlbum } from "../../api/albumCalls";
import UserAlbumLi from "../../Components/UserAlbumLi/UserAlbumLi";
import { useSelectedAlbumStore } from "../../store/selectedAlbum";
import UserAlbumCard from "../../Components/UserAlbumCard/UserAlbumCard";
import { useTagsStore } from "../../store/tags";
import { useForceRerenderStore } from "../../store/forceRerender";
import TagsInterface from "../../interfaces/TagsInterface";

function UserPage() {

    const { token } = useLoginStore();

    const { tags, setTags, setCurrentTags } = useTagsStore();

    const { selectedAlbum, setSelectedAlbum } = useSelectedAlbumStore();

    const { forceRerender } = useForceRerenderStore();

    const getUserData = async () => {
        const response = await apiGetUser(token);
        setTags(response.data);
        return response.data;
    }

    const getAlbumData = (albumId: string, initTags?: TagsInterface[]) => {
        apiGetAlbum(albumId)
        .then((res) => {
            setSelectedAlbum(res.data);
            setCurrentTags((initTags ?? tags)!.find((t) => t.albumId === res.data!.albumId)!.tags);
        });
        
    }

    useEffect(() => {
        setSelectedAlbum(null)
        getUserData().then((res) => {
            if (res && res.length > 0) getAlbumData(res[Math.floor(Math.random()*res.length)].albumId, res)
        })
    }, []);

    return (
        <div className="content-centerer">
            <section className="my-albums">
                <h2>My albums</h2>
                {tags?.map(album => <UserAlbumLi
                    {...album}
                    onClick={() => {getAlbumData(album.albumId); forceRerender();}}
                    key={album.albumId}/>)}
            </section>
            {selectedAlbum && <UserAlbumCard/>}
        </div>
    )
}

export default UserPage;