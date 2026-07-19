import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from './Navbar.module.css'
import { useState } from "react";
import logo from "../assets/GOD.png"

function NavBar({ user, logout, loading, username, avatar, gameState, partyList, partiLeader, timer }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

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
                        <NavLink to="/parties" onClick={() => setMenuOpen(false)}>Parties </NavLink>
                        <NavLink to="/create" onClick={() => setMenuOpen(false)}>Create your party </NavLink>
                        <NavLink to="/museum" onClick={() => setMenuOpen(false)}>Museum </NavLink>
                        {user ? <NavLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</NavLink> : <NavLink to="/login" onClick={() => setMenuOpen(false)}>Login/Signup</NavLink>}
                        <p>{loading ? "Loading..." : null}</p>
                    </div>
                </div>
            </nav>
            {location.pathname == "/" && 
            <div className={styles.info}>
                {gameState?.revolution ? (
                    <h3>The tyrant has been overthrown! Emergency vote ends in{" "}
                        <span className={styles.rouge}>{timer}</span>
                    </h3>
                ) : gameState?.regne ? (
                    <h3>
                        This page belongs to the party
                        <span>{" "+ partiLeader?.title + " "}</span>
                        elected with
                        <span>{" "+partiLeader?.votes+ " "}</span>
                        votes and led by
                        <span>{" "+partiLeader?.profiles?.username}</span>.
                        Voting reopens in
                        <span>{" "+ timer }. </span>
                        <NavLink className={styles.cta} to="/create">Take its place here</NavLink>
                    </h3>
                ) : (
                    <h3>
                        <span>Election in progress. </span>
                        The winner will govern this page for 12 hours. {" "}
                        <NavLink className={styles.cta} to="/parties">Vote here</NavLink>
                    </h3>
                )}
            </div>}
        </div>
    )
}

export default NavBar