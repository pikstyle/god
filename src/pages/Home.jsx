import { useNavigate } from "react-router-dom"
import styles from './Home.module.css'

function Home({ isLeader, textHome, setTextHome, saveHomeContent, user, partiLeader }) {
    
    return ( // Maj le state localement lors du onChange et avec saveHomeContent(textHome) ecrit dans la base de donnée
        <div className={styles.div_home}>
            <h2>Parti en tête : <span className={styles.leaderName}>{partiLeader?.title}</span>, dirigé par <span className={styles.leaderName}>{partiLeader?.profiles?.username}</span></h2>
            <h1 className={styles.titre}>{textHome}</h1>
            {isLeader ? <div><input value={textHome} onChange={(e) => setTextHome(e.target.value)}/> <button onClick={() => saveHomeContent(textHome)}>Save</button></div>: null}
        </div>
    )
}

export default Home