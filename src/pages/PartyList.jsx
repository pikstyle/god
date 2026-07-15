import styles from './PartyList.module.css'
import { useNavigate } from 'react-router-dom'

function ListeParty({ partyList, vote, isVoting, gameState, timer, partiLeader, voteRevolution, userVoteRev }) {

    const navigate = useNavigate()

    const nombreVoteRevolution = gameState?.nombre_votes_revolution
    const totalVote = partyList.reduce((total, party) => total + party.votes, 0) // On fait la somme de chaque vote de chaque party
    const seuil = Math.max(5, Math.ceil(0.13 * totalVote)) // 5 au debut (tient environ pour 38 votes) et sinon 13% des votes totaux
    
    return (
        // liste ordonmée   
        <div className={styles.div}>
            <h1>LIST OF PARTIES</h1>
            <div className={styles.timer}>
                {gameState?.revolution ? (
                    <h2>Revolution in Progress. Take power in{" "}
                        <span className={styles.rouge}>{timer}</span>
                    </h2>
                ) : gameState?.regne ? (
                    <h2>
                        <span className={styles.rouge}> {partiLeader?.title}</span> won the elections, voting will reopen in:{" "}
                        <span className={styles.rouge}>{timer}</span>
                        <br />
                        <span>{nombreVoteRevolution}/{seuil}{" "}votes restant pour lancer une révolution</span>
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
                        {index === 0 && gameState?.regne ?
                        <button className={styles.btnVote} onClick={(e) => { e.stopPropagation(); voteRevolution() }} disabled={userVoteRev}>
                            {userVoteRev ? "Signé" : "Revolution"}
                        </button> : 
                        <button className={styles.btnVote} onClick={(e) => { e.stopPropagation(); vote(party.id) }} disabled={isVoting || gameState?.regne}>
                            Vote
                        </button> }
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default ListeParty