import styles from './Home.module.css'
import { useState, useEffect, useRef } from 'react'
import { supabase } from "../supabaseClients"
import imageCompression from 'browser-image-compression'


function Home({ isLeader, textHome, saveHomeContent, partiLeader, gameState, user }) {

    const [brouillon, setBrouillon] = useState({})
    const [lienUrl, setLienUrl] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false) // State pour savoir si on submit une image
    const isSubmittingRef = useRef(false) // bloque un double-upload instantanément, avant même que le state ne se mette à jour
    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
    }
    const fileInputRef = useRef(null) // avoir une ref de l'input pour upload l'image

    // quand la page publiée arrive, on la recopie dans le brouillon.
    useEffect(() => {
        if (textHome) {
            setBrouillon({...textHome})
        }
    }, [textHome]) // L'effet doit se relancer quand textHome change

    // Afficher les differents assets de la home
    function afficherBloc(bloc, index) {
        if (bloc.type === 'image') { // check si cest une image
            return <div key={index} className={styles.imageHomeDiv}  onClick={isLeader && gameState?.regne ? () => fileInputRef.current.click() : undefined}>
                    <img src={bloc.url} alt="home-image" onLoad={() => setIsSubmitting(false)} /> 
                    {isLeader && gameState?.regne && <div className={styles.calque}>Changer l'image</div>}
                </div> // on retourne une img avec les bonnes infos
        } else if (bloc.type === 'lien') { // check si cest un lien
            if (!bloc.url.startsWith('http')) { // check si le lien commence par http, sinon on return
                return null
            }
            return <a key={index} target="_blank" rel="noopener noreferrer" href={bloc.url}>{bloc.label}</a> // on retourne un lien avec les bonnes infos, on ouvre le lien dans un nouvel onglet et noopener coupe le lien vers des redirections
        }
    }

    // Envoie le fichier dans le bucket supabase, et nous rend l'url
    const handleSubmit = async (file) => {
        if (isSubmittingRef.current) return // On est entrainde submit donc on sort direct
        isSubmittingRef.current = true  // On est entrain submit 
        try {
            setIsSubmitting(true)
            const compressedFile = await imageCompression(file, options) // Image file est compress
            const chemin = `${user.id}/${Date.now()}`  // Chemin de fichier different a chaque upload
            const { data: uploadData, error: uploadError } = await supabase.storage.from('image_home').upload(chemin, compressedFile) // Upload l'image dans le bucket image_home
            if (uploadError) { // Si l'upload échoue (RLS, fichier trop lourd...), on prévient et on sort sans sauvegarder une URL cassée
                alert('Upload échoué: ' + uploadError.message)
                return
            }
            const { data: urlData } = supabase.storage.from('image_home').getPublicUrl(chemin) // Récupère l'URL publique du fichier uploadé (url générée par supabase)
            setBrouillon({ ...brouillon, medias: brouillon.medias?.map((media) => media.type === 'image' ? { ...media, url: urlData.publicUrl } : media) }) // On copie tout le brouillon sauf pour medias : pour chaque media, on check si cest une image, et si oui on change son url par la nouvelle, et sinon on laisse tel quel
        } finally {
            isSubmittingRef.current = false
        }
    }

    return (
        <div className={styles.div_home}>
            {isSubmitting && <h3>Chargement...</h3>}
            <div className={styles.titre}>{brouillon.text}</div> {/* On affiche le texte que l'user tappe*/}
            {/* Pour chaque media, on appelle afficherBloc, avec son media et son index pour les afficher*/}
            <div className={styles.divBlocHome}>{brouillon.medias?.map((media, index) => afficherBloc(media, index))}</div>
            {/* Éditeur : visible seulement pour le leader, et seulement pendant son règne */}
            {isLeader && gameState?.regne ? 
            <div>
                {/* Texte édité en direct : on copie le brouillon, on ne remplace que le champ text */}
                <input value={brouillon.text ?? ""} onChange={(e) => setBrouillon({ ...brouillon, text: e.target.value })}/>
                {/* Post-it : retient l'URL tapée, avant de la "poser" sur la page */}
                <input value={lienUrl} onChange={(e) => setLienUrl(e.target.value)}/>
                {/* Pose le lien : ajoute un média au brouillon, puis vide le post-it */}
                <button onClick={() => { 
                    // Verifie d'abord que cest un lien valide
                    if (!lienUrl.startsWith('http')) { 
                        alert("Lien invalide")
                        return null
                    }
                    setBrouillon({ ...brouillon, medias: [...brouillon.medias, { type: 'lien', url: lienUrl, label: lienUrl }] }); setLienUrl(""); }}>Ajouter un lien</button>
                {/* Retire tous les liens : garde les médias qui ne sont PAS des liens (filter) */}
                <button onClick={() => setBrouillon({ ...brouillon, medias: brouillon.medias?.filter((media) => media.type !== "lien") })}>Supprimer les liens</button>
                {/* Choisir la photo */}
                <input className={styles.inputPhoto} ref={fileInputRef} required type="file" onChange={(e) => handleSubmit(e.target.files[0])}/> {/* Récupère le fichier choisi. e.target.files[0] = le premier fichier sélectionné */}
                {/* Publie : écrit le brouillon en base, il devient la page publique vue par tous */}
                <button onClick={() => saveHomeContent(brouillon)}>Save</button>
                </div>
            : null}
        </div>
    )
}

export default Home