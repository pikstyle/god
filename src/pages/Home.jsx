import styles from './Home.module.css'
import { useState, useEffect, useRef } from 'react'
import { supabase } from "../supabaseClients"
import imageCompression from 'browser-image-compression'
import Canvas from '../components/Canvas'

function Home({ isLeader, textHome, saveHomeContent, partiLeader, gameState, user, sendAnnonce }) {

    const [lienUrl, setLienUrl] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false) // State pour savoir si on submit une image
    const isSubmittingRef = useRef(false) // bloque un double-upload instantanément, avant même que le state ne se mette à jour
    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
    }
    const fileInputRef = useRef(null) // avoir une ref de l'input pour upload l'image
    const defaultHome = {
            "canvas": {
                "h": 700,
                "w": 1200
            },
            "version": 2,
            "elements": [
                {
                    "h": 1,
                    "w": 10000,
                    "x": 75,
                    "y": 270,
                    "id": "text1",
                    "size": 90,
                    "type": "text",
                    "color": "#000000",
                    "text_content": "YOUR CONTENT HERE"
                }
            ]
        }

    const contenu = gameState?.regne ? textHome : defaultHome

    return (
        <div>
            {gameState && contenu ? <Canvas sendAnnonce={sendAnnonce} content={contenu} key={gameState.regne ? 'regne' : 'election'} editable={isLeader && gameState?.regne} user={user} onSave={saveHomeContent} /> : null}

        </div>
    )
}

export default Home