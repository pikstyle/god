import { useState } from "react" 
import { supabase } from '../supabaseClients'
import { useNavigate, Link } from "react-router-dom"
import styles from './Auth.module.css'

function Login({ setUser }) {
    const [email, setEmail] = useState('')
    const [mdp, setMdp] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate() // Hook qui lance la fonction pour naviguer
    const [showMdp, setShowMdp] = useState(false)

    // Submit le form et login
    const handleSubmit = async (event) => {
        event.preventDefault()
        const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: mdp }) // Connecte l'user lors de la connexion et le stocke dans data
        if (error) {
            setErrorMsg('Incorrect email or password.')
            return
        }
        setUser(data.user) // Maj le state local avec le bon user
        navigate('/') // Aller à la page home lors de la connexion
    }

    return (
        <div className={styles.div}>
            <h1>LOGIN</h1>
            <form className={styles.form_auth} onSubmit={handleSubmit}>
                <button className={styles.button} type='button' onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>Login with Google</button>
                <div className={styles.separateur}>Or</div>
                <label>Email</label>
                <input className={styles.inputs} required type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <label>Password</label>
                <input className={styles.inputs} required type={showMdp ? 'text' : 'password'} value={mdp} onChange={(e) => setMdp(e.target.value)}/>
                <button type="button" onClick={() => setShowMdp(!showMdp)}>{showMdp ? 'Hide' : 'Show'}</button>
                <button className={styles.button} type="submit">Login</button>
                <div className={styles.auth_question}>
                    <h4>Don't have an account yet? </h4>
                    <Link className={styles.link} to="/signup"> Signup</Link>
                </div>
                {errorMsg && <p>{errorMsg}</p>}
            </form>
        </div>
    )
}

export default Login