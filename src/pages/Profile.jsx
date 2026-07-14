import { useState } from "react"
import styles from './Profile.module.css'
import imageCompression from 'browser-image-compression'

function Profile( {user, updateProfile, profile, logout} ) {
    const [username, setUsername] = useState("")
    return (
        <div className={styles.div}>
            <h1>PROFILE</h1>
            <div className={styles.div_princ}>
                <h2>{profile?.username}</h2>
                {profile?.avatar_url && <img className={styles.avatar_image} src={profile.avatar_url} alt="avatar"/>}
                <label>Change your name: </label>
                <input  type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <button onClick={() => updateProfile({ username, avatar_url: profile?.avatar_url })}>Save</button>
                <button onClick={() => logout()}>Logout</button>
            </div>
        </div> 
    )
}

export default Profile