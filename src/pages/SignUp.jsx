import { useState } from "react" 
import { supabase } from '../supabaseClients'
import { useNavigate } from "react-router-dom"

function SignUp({ setUser }) {
    const [email, setEmail] = useState('')
    const [mdp, setMdp] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const navigate = useNavigate() // Hook qui lance la fonction pour naviguer

    // Submit le form et signup
    const handleSubmit = async (event) => {
        event.preventDefault()
        const { data, error } = await supabase.auth.signUp({ email: email, password: mdp}) // Crée l'user lors de la connexion et le stocke dans data
        setUser(data.user) // Maj le state local avec le bon user
        setEmailSent(true) // Quand on submit le form, mettre que l'email de verif à été envoyé
        if (data.user.email_confirmed_at) {
            navigate('/onboarding')
        } else {
            setEmailSent(true)
}
    }

    return (
        <>
            {!emailSent ? <div><form onSubmit={handleSubmit}><h1>SignUp</h1>
            <label>Email</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label>Mot de passe</label>
            <input type="password" value={mdp} onChange={(e) => setMdp(e.target.value)}/>
            <button>SignUp</button>
            <button type="button" onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>Signup avec Google</button>
            </form></div> : <p>Vous devez verif votre mail</p>}
        </>
    )
}

export default SignUp