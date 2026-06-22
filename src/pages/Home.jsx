import { useNavigate } from "react-router-dom"
import styles from './Home.module.css'

function Home({ isLeader, textHome, setTextHome, saveHomeContent, user, partiLeader }) {

    const navigate = useNavigate() 
    
    return ( // Maj le state localement lors du onChange et avec saveHomeContent(textHome) ecrit dans la base de donnée
        <div className={styles.div_home}>
            <h2>Parti en tête : <span className={styles.leaderName}>{partiLeader?.title}</span>, dirigé par <span className={styles.leaderName}>{partiLeader?.profiles?.username}</span></h2>
            <h1 className={styles.titre}>{textHome}</h1>
            {!user ? <button className={styles.entrer} onClick={() => navigate('/login')}>Entrer</button> : isLeader ? <div><input value={textHome} onChange={(e) => setTextHome(e.target.value)}/> <button onClick={() => saveHomeContent(textHome)}>Save</button></div>: <p>{null}</p>}
        </div>
    )
}

export default Home