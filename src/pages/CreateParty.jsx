import { useState, useRef } from "react"

function CreateParty({ addParty }) {

    // Variables de création des partis
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [partyLogo, setPartyLogo] = useState(null)
    const isSubmittingRef = useRef(false) // isSubmittingRef = { current: false } 
    const [isSubmitting, setIsSubmitting] = useState(false) // State pour savoir si on submit une creation de parti
    const fileInputRef = useRef(null) // Ref pour vider l'input file du logo party

    // Quand on envoie le form
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (partyLogo.size > 1 * 1024 * 1024) { // Verifie que le logo est inf a 1MB
            alert('Image trop lourde, max 1MB')
            return
        }
        if (isSubmittingRef.current) return // On est entrainde submit donc on sort direct
        isSubmittingRef.current = true
        try {
            setIsSubmitting(true)
            await addParty({ title: title, description: description, logoFile: partyLogo, votes: 0})
            // Apres avoir crée le parti on reset les inputs
            setTitle("")
            setDescription("")
            setPartyLogo() // Vide le state logo party
            fileInputRef.current.value = '' // Vider l'input file
            alert('Parti créé !')
        } finally {
            isSubmittingRef.current = false
            setIsSubmitting(false)
        }
    }
 
    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>Titre</label>
                <input required type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <label>Description</label>
                <textarea required name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                <label>Logo</label>
                <input ref={fileInputRef} required type="file" id="logoParti" onChange={(e) => setPartyLogo(e.target.files[0])}/>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Création..." : "Créer le parti"}</button>
            </form>
        </>
    )
}

export default CreateParty