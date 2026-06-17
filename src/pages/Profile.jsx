import { useState } from "react"

function Profile( {user, updateProfile, profile, logout} ) {
    const [username, setUsername] = useState("")
    return (
        <div>
            <h1>Profile</h1>
            <h3>{profile?.username}</h3>
            {profile?.avatar_url && <img src={profile.avatar_url} alt="avatar"/>}
            <h2>Update le profile : </h2> {/* Affiche la photo seulement si avatar_url existe (évite le flash de la pdp Google au chargement) */}
            <label>Noueau pseudo : </label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <button onClick={() => updateProfile({ username, avatar_url: profile?.avatar_url })}>Save</button>
            <button onClick={() => logout()}>Logout</button>
        </div> 
    )
}

export default Profile