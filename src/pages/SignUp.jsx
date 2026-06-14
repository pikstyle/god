import { useState } from "react" 
import { supabase } from '../supabaseClients'
import { useNavigate } from "react-router-dom"

function SignUp({ setUser }) {
    const [email, setEmail] = useState('')
    const [mdp, setMdp] = useState('')
    const navigate = useNavigate() // Hook qui lance la fonction pour naviguer

    // Submit le form et signup
    const handleSubmit = async (event) => {
        event.preventDefault()
        const { data, error } = await supabase.auth.signUp({ email: email, password: mdp}) // Crée l'user lors de la connexion et le stocke dans data
        setUser(data.user) // Maj le state local avec le bon user
        navigate('/') // Aller à la page home lors de la connexion
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>SignUp</h1>
            <label>Email</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label>Mot de passe</label>
            <input type="password" value={mdp} onChange={(e) => setMdp(e.target.value)}/>
            <button>SignUp</button>
        </form>
    )
}

export default SignUp