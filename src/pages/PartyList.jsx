import styles from './PartyList.module.css'
import { useNavigate } from 'react-router-dom'

function ListeParty({ partyList, vote, isVoting, gameState, timer }) {

    const navigate = useNavigate()
    
    return (
        // liste ordonmée
        <div className={styles.div}>
            <h1>LISTE DES PARTIS</h1>
            <div className={styles.timer}>
                <h2>{gameState?.regne ? "Fin du mandat dans : " : "Élection du nouveau parti dans : "}{timer}</h2>
            </div>
            <ol className={styles.liste}>
                {partyList.map((party, index) => (
                    // Le leader (index 0) reçoit une classe en plus : .ligne .leader
                    <li key={party.id} className={`${styles.ligne} ${index === 0 ? styles.leader : ''}`} onClick={() => navigate(`\/party/${party.id}`)}>
                        <span className={styles.rang}>#{index + 1}</span>
                        <img className={styles.logo} src={party.logo_url} alt="logo-party" />
                        <div className={styles.identite}>
                            <h3 className={styles.titre}>
                                {party.title}
                            </h3>
                            <p className={styles.meta}>Dirigé par : {party.profiles?.username}</p>
                        </div>
                        {/* Description au centre : prend l'espace restant, tronquée à 1 ligne */}
                        <p className={styles.description}>{party.description}</p>
                        <div className={styles.votes}>
                            <span className={styles.voteNombre}>{party.votes}</span>
                            <span className={styles.voteLabel}>votes</span>
                        </div>
                        {/* e.stopPropagation() perment de cliquer sur voter dans que usenavigate s'active */}
                        <button className={styles.btnVote} onClick={(e) => { e.stopPropagation(); vote(party.id) }} disabled={isVoting || gameState?.regne}>
                            Voter
                        </button>
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default ListeParty