import styles from './Footer.module.css'

function Footer() {
    return (
        <div className={styles.container}>
            <footer className={styles.footer}>
                <div className={styles.inner}>
                    <a target="_blank" href="https://discord.gg/AMNYvNxfEs">Discord</a>
                    <p>Create by jeune sim</p>
                    <p>Contact</p>
                </div>
            </footer>
        </div>
    )
}

export default Footer