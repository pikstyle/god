import { Link } from "react-router-dom";

function NavBar() {
    return (
        <div>
            <Link to="/">Home</Link>
            <Link to="/create">Creer un parti</Link>
            <Link to="/parties">Liste des partis</Link>

        </div>
    )
}

export default NavBar