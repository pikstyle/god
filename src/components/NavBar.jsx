import { Link } from "react-router-dom";

function NavBar({ user, logout }) {
    return (
        <div>
            <Link to="/">Home </Link>
            <Link to="/create">Creer un parti </Link>
            <Link to="/parties">Liste des partis </Link>
            <Link to="/signup">Signup </Link>
            <Link to="/login">Login </Link>
            <button onClick={logout}>Logout</button>
            <p>{user ? user.email : 'Non connecté'}</p>
        </div>
    )
}

export default NavBar