import styles from './PartyList.module.css'

function PodiumCard({ party, styleClass, vote, isVoting, gameState }) {
    return (
        <div className={`${styles.podiumTier} ${styleClass}`}>
            <div className={styles.troneRow}>
                <div className={styles.troneLeft}>
                    <img className={styles.image} src={party.logo_url} alt="logo-party" />
                    <div>
                        <h2>{party.title}</h2>
                        <div className={styles.carteInfos}>
                            <p>Dirigé par : {party.profiles?.username}</p>
                            <p className={styles.description}>{party.description}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={styles.footer}>
                        <div className={styles.votes}>
                            <span className={styles.voteNombre}>{party.votes}</span> votes
                        </div>
                        <button className={styles.btnVote} onClick={() => vote(party.id)} disabled={isVoting || gameState?.regne}>{gameState?.regne ? "Règne en cours" : "Voter"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PodiumCard