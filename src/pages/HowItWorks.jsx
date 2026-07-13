import styles from './HowItWorks.module.css'
import logo from "../assets/GOD.png"


function HowItWorks() {
    return (
        <div>
            <h1  className={styles.container}>How it works ?</h1>
            <div className={styles.parent}>
                <div className={styles.div}>
                    <div className={styles.text}>
                        <p>Dans The Game of Democracy (GOD), une seule personne possède le pouvoir de contrôler la page d'honneur. Mais tout le monde peut lui prendre sa place.</p>
                        <br />
                        <p>En effet, le contenu et le design de la page d'honneur ont été entièrement créés par le leader du parti possédant le plus de votes.</p>
                        <br />
                        <p>Ainsi, par la grâce de la démocratie, chacun peut tenter d'exprimer ce qu'il veut au monde entier, et ce pendant tout le temps où il restera leader.</p>
                        <p>Vous avez un message à faire passer ? Faites partie d'une communauté, ou même cherchez à choquer ? </p>
                    </div>
                    <div className={styles.important}>
                        <h2>Alors créez un parti, et commencez à convaincre le monde de voter pour vous. </h2>
                    </div>
                </div>
                <img className={styles.imageFond} src={logo} alt="logo" />
            </div>
        </div>
    )
}

export default HowItWorks