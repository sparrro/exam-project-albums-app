import "./NavMenu.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginStore } from "../../store/login";

function NavMenu() {

    const navigate = useNavigate();

    const { username, logOut } = useLoginStore();

    const handleLogout = () => {
        logOut();
        navigate("/");
    }

    return (
        <nav>
            {
                username == "" ?
                <NavLink to={"/"} className={({isActive}) => (isActive ? "active" : "")}>Log in</NavLink> :
                <button onClick={handleLogout}>Log out</button>
            }
            <NavLink to={"/search"} className={({isActive}) => (isActive ? "active" : "")}>Search</NavLink>
            { username != "" &&
            <NavLink to={`/user/${username}`} className={({isActive}) => (isActive ? "active" : "")}>My albums</NavLink>
            }
            { username != "" &&
            <NavLink to={"/add"} className={({isActive}) => (isActive ? "active" : "")}>Add album</NavLink>
            }
        </nav>
    )
}

export default NavMenu