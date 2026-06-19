import styles from './HowItWorks.module.css'
import logo from "../assets/GOD.png"


function HowItWorks() {
    return (
        <>
            <h1 className={styles.titre}>How It Works ?</h1>
            <div className={styles.div}>
                <div className={styles.text}>
                <p>The Game of Democracy (GOD) est une plateforme en ligne controlée par ses utilisateurs.</p>
                <br />
                <p>En particulier, le contenu et le design de la page d'acceuil a entièrement été créé par le leader du parti possèdant le plus de votes.</p>
                <br />
                <p>Par le fruit de la démocratie, chacun peut tenter d'exprimer ce qu'il veut au monde entier, et ce pendant tout le temps il où restera leader.</p>
                <br />
                <h4>Vous avez un message à faire passer ? Faites parti d'une communauté, ou même cherchez à choquer ? </h4>
                </div>
                <div className={styles.important}>
                    <h2>Alors créez un parti, et commencez à convaincre le monde de voter pour vous. </h2>
                </div>
                <img src={logo} alt="logo" />
            </div>


        </>
    )
}

export default HowItWorks