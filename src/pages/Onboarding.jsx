import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Onboarding( {user, profile, updateProfile} ) {
    const [username, setUsername] = useState("")
    const navigate = useNavigate()

    // Quand on clique sur save
    const handleSubmit = async (event) => {
        event.preventDefault()
        await updateProfile({ username, avatar_url: profile?.avatar_url }) // Update le profile 
        navigate('/') // Navigue à Home
    }
    
    return (
        
    <form onSubmit={handleSubmit}>
        <label>Votre pseudo </label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <button type="submit">Save</button>
    </form>
    )
}

export default Onboarding