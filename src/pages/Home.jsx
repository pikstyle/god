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
                "h": 78,
                "w": 1141,
                "x": 32.631193032949795,
                "y": 72.9297081776406,
                "id": "text1",
                "size": 60,
                "type": "text",
                "color": "#ff2600",
                "text_content": "TAKE FULL CONTROL OF THIS PAGE"
            },
            {
                "h": 381,
                "w": 886,
                "x": 154.0031799345656,
                "y": 209.77634408100252,
                "id": "7a6e9649-6314-4f89-a161-49aafe85919a",
                "url": "https://media0.giphy.com/media/v1.Y2lkPThkYjI3YzdmZjdtdzhnMXNtcDZwcHI0YnpzOHBlNG9rZDlwbnR3Yjdua2h1enFiNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/MMquV2oInK40V86Q7g/200.gif",
                "type": "gif"
            },
            {
                "h": 24,
                "w": 138,
                "x": 515.1756441369245,
                "y": 602.5367864420216,
                "id": "b7a0852f-1311-444d-9a31-9744e7cd3e64",
                "size": 15,
                "type": "text",
                "color": "#000000",
                "text_content": "(this could be you)"
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