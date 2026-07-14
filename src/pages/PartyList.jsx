import styles from './PartyList.module.css'
import { useNavigate } from 'react-router-dom'

function ListeParty({ partyList, vote, isVoting, gameState, timer, partiLeader }) {

    const navigate = useNavigate()
    
    return (
        // liste ordonmée
        <div className={styles.div}>
            <h1>LIST OF PARTIES</h1>
            <div className={styles.timer}>
                {gameState?.regne ? (
                    <h2>
                        <span className={styles.rouge}> {partiLeader?.title}</span> won the elections, voting will reopen in:{" "}
                        <span className={styles.rouge}>{timer}</span>
                    </h2>
                ) : (
                    <h2>
                        Election of the new party in:{" "}
                        <span className={styles.rouge}>{timer}</span>
                    </h2>
                )}
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
                            <p className={styles.meta}>Led by: {party.profiles?.username}</p>
                        </div>
                        {/* Description au centre : prend l'espace restant, tronquée à 1 ligne */}
                        <p className={styles.description}>{party.description}</p>
                        <div className={styles.votes}>
                            <span className={styles.voteNombre}>{party.votes}</span>
                            <span className={styles.voteLabel}>votes</span>
                        </div>
                        {/* e.stopPropagation() perment de cliquer sur voter dans que usenavigate s'active */}
                        <button className={styles.btnVote} onClick={(e) => { e.stopPropagation(); vote(party.id) }} disabled={isVoting || gameState?.regne}>
                            Vote
                        </button>
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default ListeParty