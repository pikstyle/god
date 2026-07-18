import styles from './Home.module.css'
import { useState, useEffect, useRef } from 'react'
import { supabase } from "../supabaseClients"
import imageCompression from 'browser-image-compression'
import Canvas from '../components/Canvas'

function Home({ isLeader, textHome, saveHomeContent, partiLeader, gameState, user, sendAnnonce }) {

    const [lienUrl, setLienUrl] = useState("")
    const [messageDiscord, setMessageDiscord] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false) // State pour savoir si on submit une image
    const isSubmittingRef = useRef(false) // bloque un double-upload instantanément, avant même que le state ne se mette à jour
    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
    }
    const fileInputRef = useRef(null) // avoir une ref de l'input pour upload l'image

    return (
        <div>
                {textHome ? <Canvas content={textHome} editable={isLeader && gameState?.regne} user={user} onSave={saveHomeContent} /> : null}
                <input type="text" value={messageDiscord} onChange={(e) => setMessageDiscord(e.target.value)} placeholder='Faire une annonce discord'/>
                {/* Bouton envoyer discord annonces */}
                <button onClick={() => {
                    if (messageDiscord === '') {
                        alert("Veuillez inclure un message")
                        return 
                    }
                    sendAnnonce(messageDiscord), setMessageDiscord("")}}>Envoyer sur discord</button>
        </div>
    )
}

export default Home