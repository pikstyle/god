import styles from './Footer.module.css'
import { NavLink } from 'react-router-dom'

function Footer() {
    return (
        <div className={styles.container}>
            <footer className={styles.footer}>
                <div className={styles.inner}>
                    <a target="_blank" href="https://discord.gg/gyUvG3HW9F">Discord</a>
                    <a href="mailto:pro.pikstyle@gmail.com">Contact</a>
                    <NavLink to="/cgu">CGU</NavLink>

                </div>
            </footer>
        </div>
    )
}

export default Footer