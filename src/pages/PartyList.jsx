import styles from './PartyList.module.css'

function ListeParty({ partyList, vote, isVoting, gameState }) {
    return (
        // liste ordonmée
        <ol className={styles.liste}>
            {partyList.map((party, index) => (
                // Le leader (index 0) reçoit une classe en plus : .ligne .leader
                <li key={party.id} className={`${styles.ligne} ${index === 0 ? styles.leader : ''}`}>
                    <span className={styles.rang}>#{index + 1}</span>
                    <img className={styles.logo} src={party.logo_url} alt="logo-party" />
                    <div className={styles.identite}>
                        <h3 className={styles.titre}>
                            {party.title}
                            {index === 0 && <span className={styles.tag}>Au pouvoir</span>}
                        </h3>
                        <p className={styles.meta}>Dirigé par : {party.profiles?.username}</p>
                    </div>
                    {/* Description au centre : prend l'espace restant, tronquée à 1 ligne */}
                    <p className={styles.description}>{party.description}</p>
                    <div className={styles.votes}>
                        <span className={styles.voteNombre}>{party.votes}</span>
                        <span className={styles.voteLabel}>votes</span>
                    </div>
                    <button className={styles.btnVote} onClick={() => vote(party.id)} disabled={isVoting || gameState?.regne}>
                        Voter
                    </button>
                </li>
            ))}
        </ol>
    )
}

export default ListeParty