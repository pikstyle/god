import { useState, useRef } from "react"
import styles from './CreateParty.module.css'
import imageCompression from 'browser-image-compression'

function CreateParty({ addParty }) {

    // Variables de création des partis
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [descriptionLongue, setDescriptionLongue] = useState("")
    const [partyLogo, setPartyLogo] = useState(null)
    const isSubmittingRef = useRef(false) // isSubmittingRef = { current: false } 
    const [isSubmitting, setIsSubmitting] = useState(false) // State pour savoir si on submit une creation de parti
    const fileInputRef = useRef(null) // Ref pour vider l'input file du logo party
    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
    }
    // Quand on envoie le form
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (title.length > 15) {
            alert('Titre de parti trop long, max 15 caractères')
            return
        }    
        if (description.length > 50) {
            alert('Slogan trop long, max 50 caractères')
            return
        }
        if (descriptionLongue.length > 2000) {
            alert('Description trop longue, max 2000 caractères')
            return
        }
        // if (partyLogo.size > 1 * 1024 * 1024) { // Verifie que le logo est inf a 1MB
        //    alert('Image trop lourde, max 1MB')
        //    return
        // }
        if (isSubmittingRef.current) return // On est entrainde submit donc on sort direct
        isSubmittingRef.current = true
        try {
            setIsSubmitting(true)
            const compressedFile = await imageCompression(partyLogo, options) // Avatar file est compress
            const { error } = await addParty({ title: title, description: description, logoFile: compressedFile, votes: 0, description_longue: descriptionLongue})
            // Si on catch une erreur alors on ne cree pas le parti
            if (error) {
                alert(error.code === '23505' ? 'Ce nom de parti est déjà pris, choisissez-en un autre' : 'Erreur lors de la création du parti')
                return // 23505 : code d'erreur standard de PostgreSQL : violé une contrainte unique
            }
            // Apres avoir crée le parti on reset les inputs
            setTitle("")
            setDescription("")
            setDescriptionLongue("")
            setPartyLogo() // Vide le state logo party
            fileInputRef.current.value = '' // Vider l'input file
            alert('Parti créé !')
        } finally {
            isSubmittingRef.current = false
            setIsSubmitting(false)
        }
    }
 
    return (
        <div className={styles.div}>
            <h1>CRÉER UN PARTI</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <label>Titre (Max 15 caractères)</label>
                <input className={styles.inputs} required type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <label>Slogan (Max 50 caractères)</label>
                <input className={styles.inputs} required name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)}></input>
                <label>Description (Max 1000 caractères)</label>
                <textarea className={styles.inputs} required name="descriptionLongue" id="descriptionLongue" value={descriptionLongue} onChange={(e) => setDescriptionLongue(e.target.value)}></textarea>
                <label>Logo</label>
                <input className={styles.file_input} ref={fileInputRef} required type="file" id="logoParti" onChange={(e) => setPartyLogo(e.target.files[0])}/>
                <button className={styles.button} type="submit" disabled={isSubmitting}>{isSubmitting ? "Création..." : "Créer le parti"}</button>
            </form>
        </div>
    )
}

export default CreateParty