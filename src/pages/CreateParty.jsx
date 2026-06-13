import { useState } from "react"

function CreateParty({ addParty }) {

    // Variables de création des partis
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [partyLogo, setPartyLogo] = useState()

    // Quand on envoie le form
    const handleSubmit = (event) => {
        event.preventDefault()
        addParty({ id: Date.now(), title: title, description: description, logo: partyLogo, vote: 0})
    }
 
    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Titre</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <label htmlFor="description">Description</label>
                <textarea name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                <label htmlFor="logoParti">Logo</label>
                <input type="file" id="logoParti" onChange={(e) => setPartyLogo(e.target.files[0])}/>
                <button type="submit">Créer le parti</button>
            </form>
        </>
    )
}

export default CreateParty