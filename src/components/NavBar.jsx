import { NavLink } from "react-router-dom";
import styles from './Navbar.module.css'
import { useState } from "react";
import logo from "../assets/GOD.png"
import logoBlanc from "../assets/GOD-blanc.png"
import { useLocation } from "react-router-dom";

function NavBar({ user, logout, loading, username, avatar, gameState, partyList, partiLeader, timer }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.navInner}>
                    <NavLink to="/" className={styles.logo}>
                        <img src={gameState?.regne ? partyList?.[0]?.logo_url : logo} alt="logo-party" />
                        <h3>{gameState?.regne ? partyList?.[0]?.title : "GOD"}</h3>
                    </NavLink>
                    <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
                    {/* on colle la classe "open" seulement quand menuOpen est vrai */}
                    <div className={`${styles.right} ${menuOpen ? styles.open : ''}`}>
                        <NavLink to="/hiw" onClick={() => setMenuOpen(false)}>How it works ? </NavLink>
                        <NavLink to="/parties" onClick={() => setMenuOpen(false)}>Liste des partis </NavLink>
                        <NavLink to="/create" onClick={() => setMenuOpen(false)}>Creer un parti </NavLink>
                        {user ? <NavLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</NavLink> : <NavLink to="/login" onClick={() => setMenuOpen(false)}>Login/Signup</NavLink>}
                        <p>{loading ? "Chargement..." : null}</p>
                    </div>
                </div>
            </nav>
            {location.pathname == "/" && <div className={styles.info}><h3>Cette page appartient au parti <span>{partiLeader?.title}</span> élu avec <span>{partiLeader?.votes}</span> votes et dirigé par <span>{partiLeader?.profiles?.username}</span>. Remise en jeu dans : <span>{timer}</span></h3></div>}
        </div>
    )
}

export default NavBar