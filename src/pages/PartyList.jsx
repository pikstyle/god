import styles from './PartyList.module.css'
import PodiumCard from './PodiumCard'

function ListeParty({ partyList, vote, isVoting, gameState }) {


    // le premier parti est le leader, tout le reste dans un tableau challengers
    const [leader, second, third, ...challengers] = partyList

    return (
        <div className={styles.wrapper}>
            <div className={styles.podium}>
                {leader && <PodiumCard gameState={gameState} party={leader} styleClass={styles.first} vote={vote} isVoting={isVoting} />}
            </div>
            <div className={styles.podiumRow}>
                {second && <PodiumCard gameState={gameState} party={second} styleClass={styles.second} vote={vote} isVoting={isVoting} />}
                {third  && <PodiumCard gameState={gameState} party={third}  styleClass={styles.third}  vote={vote} isVoting={isVoting} />}
            </div>
            <ul className={styles.liste}>
                {challengers.map((party, index) => {
                return (
                    <li className={styles.carte} key={party.id}>
                        <div className={styles.infos}>
                            <img className={styles.image} src={party.logo_url} alt="logo-party" />
                            <p>#{index+4}</p>
                            <h3>{party.title}</h3>
                        </div>
                        <div className={styles.carteInfos}>
                            <p>Dirigé par : {party.profiles?.username}</p>
                            <p className={styles.description}>{party.description}</p>
                        </div>
                        <div className={styles.footer}>
                            <div className={styles.votes}>
                                <span className={styles.voteNombre}>{party.votes}</span> votes
                            </div>
                            <button className={styles.btnVote} onClick={() => vote(party.id)} disabled={isVoting || gameState?.regne}>{gameState?.regne ? "Règne en cours" : "Voter"}</button>
                        </div>
                    </li>
                )
                })}
            </ul>
        </div>
    )
}

export default ListeParty