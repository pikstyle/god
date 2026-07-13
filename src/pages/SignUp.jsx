import { useState } from "react" 
import { supabase } from '../supabaseClients'
import { useNavigate, Link } from "react-router-dom"
import styles from './Auth.module.css'

function SignUp({ setUser }) {
    const [email, setEmail] = useState('')
    const [mdp, setMdp] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const navigate = useNavigate() // Hook qui lance la fonction pour naviguer

    // Signup avec email et mot de passe
    const handleSubmit = async (event) => {
        event.preventDefault()
        const { data, error } = await supabase.auth.signUp({ email: email, password: mdp}) // Crée l'user lors de l'inscription
        if (error) return // Si y'a une erreur execute pas le reste
        setUser(data.user) // Maj le state local avec le bon user
        if (data.user?.email_confirmed_at) { // "?" évite un crash si data.user est null
            navigate('/onboarding')
        } else {
            setEmailSent(true)
}
    }

    return (
        <>
            {!emailSent ? <form className={styles.form_auth} onSubmit={handleSubmit}><h1>SIGN-UP</h1>
            <button className={styles.button} type="button" onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>Signup avec Google</button>
            <div className={styles.separateur}>Ou</div>
            <label>Email</label>
            <input className={styles.inputs} required type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label>Mot de passe</label>
            <input className={styles.inputs} required type="password" value={mdp} onChange={(e) => setMdp(e.target.value)}/>
            <button className={styles.button}>SignUp</button>
            <div className={styles.auth_question}>
                <h3>Déjà un compte ? </h3>
                <Link className={styles.link} to="/login"> Login</Link>
            </div>
            </form> : <p>Vous devez verif votre mail</p>}
        </>
    )
}

export default SignUp