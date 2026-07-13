import { useState } from "react"
import styles from './Profile.module.css'
import imageCompression from 'browser-image-compression'

function Profile( {user, updateProfile, profile, logout} ) {
    const [username, setUsername] = useState("")
    return (
        <div className={styles.div}>
            <h1>PROFILE</h1>
            <div className={styles.div_princ}>
                <h3>{profile?.username}</h3>
                {profile?.avatar_url && <img className={styles.avatar_image} src={profile.avatar_url} alt="avatar"/>}
                <h2>Update le profile : </h2> {/* Affiche la photo seulement si avatar_url existe (évite le flash de la pdp Google au chargement) */}
                <label>Noueau pseudo : </label>
                <input className={styles.inputs} type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <button className={styles.button} onClick={() => updateProfile({ username, avatar_url: profile?.avatar_url })}>Save</button>
                <button className={styles.button} onClick={() => logout()}>Logout</button>
            </div>
        </div> 
    )
}

export default Profile