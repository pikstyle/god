import { NavLink } from "react-router-dom";
import styles from './Navbar.module.css'
import { useState } from "react";
import logo from "../assets/GOD.png"
import logoBlanc from "../assets/GOD-blanc.png"


function NavBar({ user, logout, loading, username, avatar, gameState, partyList }) {
    const [menuOpen, setMenuOpen] = useState(false)
    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.navInner}>
                    <NavLink to="/" className={styles.logo}>
                        <img src={gameState?.regne ? partyList?.[0]?.logo_url : logo} alt="logo-party" />
                        <h1>{gameState?.regne ? partyList?.[0]?.title : "GOD"}</h1>
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
                </div>
            </nav>
        </div>
    )
}

export default NavBar