import { Link } from "react-router-dom";

function NavBar() {
    return (
        <div>
            <Link to="/">Home </Link>
            <Link to="/create">Creer un parti </Link>
            <Link to="/parties">Liste des partis </Link>
            <Link to="/signup">Signup </Link>
            <Link to="/login">Login </Link>


        </div>
    )
}

export default NavBar