import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "./AuthContext";

const NavBar = ({ login, logout, register }) => {
    const { user } = useContext(AuthContext);
    return (
        <nav>
            <ul>
                <li><Link to="/">Main</Link></li>
                {!!user && <li><Link to="/page1">Page1</Link></li>}
                <li><Link to="/page2">Page2</Link></li>
                {user ? (
                    <>
                        <li><Link to="/lobby">Lobby</Link></li>
                        <li><button onClick={logout}>Logout</button></li>
                    </>) : (
                    <>
                        <li><button onClick={register}>Register</button></li>
                        <li><button onClick={login}>Login</button></li>
                    </>)}
            </ul>
            <div>{!!user && <span>Logged in as {user.name}</span>}</div>
        </nav>
    );
};

export default NavBar;