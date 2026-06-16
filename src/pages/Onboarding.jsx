import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Onboarding( {user, profile, updateProfile} ) {
    const [username, setUsername] = useState("")
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        updateProfile({ username, avatar_url: profile?.avatar_url })
        navigate('/')
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