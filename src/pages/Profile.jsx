import { useEffect, useState } from "react"

function Profile( {user, updateProfile, profile} ) {
    const [username, setUsername] = useState("")

    return (
        <div>
            <h1>Profile</h1>
            <h3>{profile?.username}</h3>
            <img src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt="avatar"/>
            <h2>Update le profile : </h2>
            <label>Noueau pseudo : </label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <button onClick={() => updateProfile({ username, avatar_url: profile?.avatar_url })}>Save</button>
        </div>
    ) // prendre pdp email normal ou celle de google
}

export default Profile