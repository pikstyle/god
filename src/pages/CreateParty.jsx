import { useState, useRef } from "react"

function CreateParty({ addParty }) {

    // Variables de création des partis
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [partyLogo, setPartyLogo] = useState(null)
    const isSubmittingRef = useRef(false) // isSubmittingRef = { current: false } 

    // Quand on envoie le form
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (isSubmittingRef.current) return // On est entrainde submit donc on sort direct
        isSubmittingRef.current = true
        try {
            await addParty({ title: title, description: description, logo_url: partyLogo, votes: 0})
            // Apres avoir crée le parti on reset les inputs
            setTitle("")
            setDescription("")
            setPartyLogo()
            alert('Parti créé !')
        } finally {
            isSubmittingRef.current = false
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
                <input required type="file" id="logoParti" onChange={(e) => setPartyLogo(e.target.files[0])}/>
                <button type="submit">Créer le parti</button>
            </form>
        </>
    )
}

export default CreateParty