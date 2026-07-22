import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClients"
import imageCompression from 'browser-image-compression'
import styles from './Auth.module.css'

function Onboarding( {user, profile, updateProfile} ) {
    const [username, setUsername] = useState("")
    const [avatarFile, setAvatarFile] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false) // State pour savoir si on submit un avatar
    const isSubmittingRef = useRef(false) // isSubmittingRef = { current: false } 
    const navigate = useNavigate()
    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
    }
    // Quand on clique sur save
    const handleSubmit = async (event) => {
        event.preventDefault()
        let avatar_url = null
        if (isSubmittingRef.current) return // On est entrainde submit donc on sort direct
        isSubmittingRef.current = true
        try {
            setIsSubmitting(true)
            if (avatarFile) {
                const compressedFile = await imageCompression(avatarFile, options) // Avatar file est compress
                const { data: uploadData, error: uploadError } = await supabase.storage.from('avatars').upload(`${user.id}/avatar`, compressedFile, { upsert: true }) // Upload l'avatar dans le bucket avatars. Chemin = user.id/avatar (dossier unique par user), upsert: true écrase l'ancienne photo
                if (uploadError) { // Si l'upload échoue (RLS, fichier trop lourd...), on prévient et on sort sans sauvegarder une URL cassée
                    alert('Upload failed: ' + uploadError.message)
                    return
                }
                const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(`${user.id}/avatar`) // Récupère l'URL publique du fichier uploadé (url générée par supabase)
                avatar_url = urlData.publicUrl
            }
            await updateProfile({ username, avatar_url }) // Update le profile 
            navigate('/') // Navigue à Home
        } finally {
            isSubmittingRef.current = false
            setIsSubmitting(false)
        }
    }
    
    return (
    <div className={styles.divon}>
        <form className={styles.form_auth} onSubmit={handleSubmit}>
            <h1>Creation of your profile</h1>
            <label>Enter your nickname </label>
            <input className={styles.inputs} required type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <label>Choose your profile picture (optional)</label>
            <input className={styles.inputs} type="file" onChange={(e) => setAvatarFile(e.target.files[0])}/> {/* Récupère le fichier choisi. e.target.files[0] = le premier fichier sélectionné */}
            <button className={styles.button} disabled={isSubmitting} type="submit">{isSubmitting ? "Creation..." : "Save"}</button>
        </form>
    </div>   
    )
}

export default Onboarding