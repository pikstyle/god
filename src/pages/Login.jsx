import { useState } from "react" 
import { supabase } from '../supabaseClients'
import { useNavigate, Link } from "react-router-dom"
import styles from './Login.module.css'

function Login({ setUser }) {
    const [email, setEmail] = useState('')
    const [mdp, setMdp] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate() // Hook qui lance la fonction pour naviguer

    // Submit le form et login
    const handleSubmit = async (event) => {
        event.preventDefault()
        const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: mdp }) // Connecte l'user lors de la connexion et le stocke dans data
        if (error) {
            setErrorMsg('Email ou mot de passe incorrect')
            return
        }
        setUser(data.user) // Maj le state local avec le bon user
        navigate('/') // Aller à la page home lors de la connexion
    }

    return (
        <form className={styles.form_login} onSubmit={handleSubmit}>
            <h1>Login</h1>
            <button className={styles.button} type='button' onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>Login avec Google</button>
            <div className={styles.separateur}>Ou</div>
            <label>Email</label>
            <input className={styles.inputs} required type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label>Mot de passe</label>
            <input className={styles.inputs} required type="password" value={mdp} onChange={(e) => setMdp(e.target.value)}/>
            <button className={styles.button} type="submit">Login</button>
            <div className={styles.login_question}>
                <h3>Pas encore de compte ? </h3>
                <Link className={styles.link} to="/signup"> Signup</Link>
            </div>
            {errorMsg && <p>{errorMsg}</p>}
        </form>
    )
}

export default Login