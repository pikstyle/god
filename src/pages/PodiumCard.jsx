import styles from './PartyList.module.css'

function PodiumCard({ party, styleClass, vote, isVoting }) {
    return (
        <div className={`${styles.podiumTier} ${styleClass}`}>
            <div className={styles.troneRow}>
                <div className={styles.troneLeft}>
                    <img src={party.logo_url} alt="logo-party" />
                    <div>
                        <h1>{party.title}</h1>
                        <h3>Dirigé par : {party.profiles?.username}</h3>
                        <p>{party.description}</p>
                    </div>
                </div>
                <div className={styles.troneRight}>
                    <div className={styles.votes}>
                        <span className={styles.voteNombre}>{party.votes}</span> votes
                    </div>
                    <button className={styles.btnVote} onClick={() => vote(party.id)} disabled={isVoting}>Voter</button>
                </div>
            </div>
        </div>
    )
}

export default PodiumCard