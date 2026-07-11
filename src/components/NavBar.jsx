import { NavLink } from "react-router-dom";
import styles from './Navbar.module.css'
import { useState } from "react";
import logo from "../assets/GOD.png"


function NavBar({ user, logout, loading, username, avatar, timer, gameState }) {
    const [menuOpen, setMenuOpen] = useState(false)
    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <NavLink to="/" className={styles.logo}>
                    <img src={logo} alt="logo" />
                    <h1>GOD</h1>
                </NavLink>
                <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
                {/* on colle la classe "open" seulement quand menuOpen est vrai */}
                <div className={`${styles.right} ${menuOpen ? styles.open : ''}`}>
                    <NavLink to="/hiw" onClick={() => setMenuOpen(false)}>How it works ? </NavLink>
                    <NavLink to="/parties" onClick={() => setMenuOpen(false)}>Liste des partis </NavLink>
                    <NavLink to="/create" onClick={() => setMenuOpen(false)}>Creer un parti </NavLink>
                    {user ? <NavLink to="/profile" onClick={() => setMenuOpen(false)}>{avatar && <img className={styles.avatar} src={avatar} alt="profil" />}</NavLink> : <NavLink to="/login" onClick={() => setMenuOpen(false)}>Login/Signup</NavLink>}
                    <p>{loading ? "Chargement..." : null}</p>
                </div>
            </nav>
            <div className={styles.timer}>
                <h3>{timer} {gameState?.regne ? " avant les élections" : " avant le couronnement"}</h3>
            </div>
        </div>
    )
}

export default NavBar