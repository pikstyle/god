import { NavLink } from "react-router-dom";
import styles from './Navbar.module.css'
import logo from "../assets/GOD.png"


function NavBar({ user, logout, loading, username, avatar }) {
    return (
        <nav className={styles.navbar}>
            <NavLink to="/" className={styles.logo}>
                <img src={logo} alt="logo" />
                <h1>GOD</h1>
            </NavLink>
            <div className={styles.right}>
                <NavLink to="/hiw">How it works ? </NavLink>
                <NavLink to="/parties">Liste des partis </NavLink>
                <NavLink to="/create">Creer un parti </NavLink>
                {user ? <NavLink to="/profile">{avatar && <img className={styles.avatar} src={avatar} alt="profil" />}</NavLink> : <NavLink to="/login">Login/Signup</NavLink>}
                <p>{loading ? "Chargement..." : null}</p>
            </div>
        </nav>
    )
}

export default NavBar