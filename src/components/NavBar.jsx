import { Link } from "react-router-dom";
import styles from './Navbar.module.css'
import logo from "../assets/GOD.png"

function NavBar({ user, logout, loading, username, avatar }) {
    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.logo}>
                <img src={logo} alt="logo" />
                <h1>GOD</h1>
            </Link>
            <div className={styles.right}>
                <Link to="/hiw">How it works ? </Link>
                <Link to="/parties">Liste des partis </Link>
                <Link to="/create">Creer un parti </Link>
                <Link to="/profile">{avatar && <img className={styles.avatar} src={avatar} alt="profil" />}</Link> 
                <p>{loading ? "Chargement..." : null}</p>
            </div>
        </nav>
    )
}

export default NavBar