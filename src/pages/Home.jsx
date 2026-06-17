import { useNavigate } from "react-router-dom"
import styles from './Home.module.css'

function Home({ isLeader, textHome, setTextHome, saveHomeContent, user }) {

    const navigate = useNavigate() 
    
    return ( // Maj le state localement lors du onChange et avec saveHomeContent(textHome) ecrit dans la base de donnée
        <div className={styles.div_home}>
            {!user ? <button className={styles.entrer} onClick={() => navigate('/login')}>Entrer</button> : isLeader ? <div><input value={textHome} onChange={(e) => setTextHome(e.target.value)}/> <button onClick={() => saveHomeContent(textHome)}>Save</button></div>: <p>{null}</p>}
            <h1 className={styles.titre}>{textHome}</h1>
        </div>
    )
}

export default Home