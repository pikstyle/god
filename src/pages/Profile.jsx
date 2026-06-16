import { useEffect, useState } from "react"
import { supabase } from "../supabaseClients"

function Profile( {user, updateProfile} ) {

    const [profile, setProfile] = useState(null)

    // Recuperer le profile de l'user depuis supabase
    useEffect(() => {
        const fetchProfile = async () => {
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id) // Récupère la ligne dans la table profiles où id = user.id
            setProfile(data[0]) // Stocke le profile et maj le state
        }
        fetchProfile()
    }, [user])

    return (
        <div>
            <h1>Profile</h1>
            <h2>{profile?.username}</h2>
            <img src={profile?.avatar_url} alt="avatar"/>
        </div>
    )
}

export default Profile