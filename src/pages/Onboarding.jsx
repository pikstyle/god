import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClients"

function Onboarding( {user, profile, updateProfile} ) {
    const [username, setUsername] = useState("")
    const [avatarFile, setAvatarFile] = useState(null)
    const navigate = useNavigate()

    // Quand on clique sur save
    const handleSubmit = async (event) => {
        event.preventDefault()
        const { data: uploadData, error: uploadError } = await supabase.storage.from('avatars').upload(`${user.id}/avatar`, avatarFile, { upsert: true }) // Upload l'avatar dans le bucket avatars. Chemin = user.id/avatar (dossier unique par user), upsert: true écrase l'ancienne photo
        if (uploadError) { // Si l'upload échoue (RLS, fichier trop lourd...), on prévient et on sort sans sauvegarder une URL cassée
            alert('Upload échoué: ' + uploadError.message)
            return
        }
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(`${user.id}/avatar`) // Récupère l'URL publique du fichier uploadé (url générée par supabase)
        await updateProfile({ username, avatar_url: urlData.publicUrl }) // Update le profile 
        navigate('/') // Navigue à Home
    }
    
    return (
        
    <form onSubmit={handleSubmit}>
        <label>Votre pseudo </label>
        <input required type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <input required type="file" onChange={(e) => setAvatarFile(e.target.files[0])}/> {/* Récupère le fichier choisi. e.target.files[0] = le premier fichier sélectionné */}

        <button type="submit">Save</button>
    </form>
    )
}

export default Onboarding