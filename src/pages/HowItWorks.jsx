import styles from './HowItWorks.module.css'
import logo from "../assets/GOD.png"
import back from "../assets/Back.png"


function HowItWorks() {
    return (
        <div>
            <h1  className={styles.container}>How it works ?</h1>
            <div className={styles.parent}>
                <div className={styles.div}>
                    <div className={styles.text}>
                        <p>In The Game of Democracy (GOD), only one person has the power to control the Hall of Honor page. But anyone can take their place.</p>
                        <br />
                        <p>The content and design of the Hall of Honor page were entirely created by the leader of the party with the most votes.</p>
                        <br />
                        <p>Through the power of democracy, anyone can try to express whatever they want to the entire world, for as long as they remain the leader.</p>
                        <p>Do you have a message to share? Are you part of a community, or perhaps looking to provoke?</p>
                    </div>
                    <div className={styles.important}>
                        <h2>So create a party, and start convincing everyone to vote for you</h2>
                    </div>
                </div>
                <img className={styles.imageFond} src={back} alt="logo" />
            </div>
        </div>
    )
}

export default HowItWorks