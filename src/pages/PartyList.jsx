import styles from './PartyList.module.css'
import PodiumCard from './PodiumCard'

function ListeParty({ partyList, vote, isVoting, gameState }) {


    // le premier parti est le leader, tout le reste dans un tableau challengers
    const [leader, second, third, ...challengers] = partyList

    return (
        <>
        <div className={styles.podium}>
            {leader && <PodiumCard gameState={gameState} party={leader} styleClass={styles.first} vote={vote} isVoting={isVoting} />}
            </div>
            <div className={styles.podiumRow}>
            {second && <PodiumCard gameState={gameState} party={second} styleClass={styles.second} vote={vote} isVoting={isVoting} />}
            {third  && <PodiumCard gameState={gameState} party={third}  styleClass={styles.third}  vote={vote} isVoting={isVoting} />}
        </div>
            <ul className={styles.liste}>
                {challengers.map((party) => {
                return (
                    <li className={styles.carte} key={party.id}>
                        <div className={styles.infos}>
                          {/* {party.profiles?.avatar_url && <img src={party.profiles.avatar_url} alt="avatar" referrerPolicy="no-referrer"/>} Photo du créateur si elle existe. referrerPolicy="no-referrer" empêche Google de bloquer l'image */}
                            <img src={party.logo_url} alt="logo-party" />
                            <h2>{party.title}</h2>
                        </div>
                        <p>{party.description}</p>

                        <div className={styles.votes}>
                            <span className={styles.voteNombre}>{party.votes}</span> votes
                        </div>
                        <h3>Dirigé par : {party.profiles?.username}</h3>
                        <button className={styles.btnVote} onClick={() => vote(party.id)} disabled={isVoting || gameState?.regne}>{gameState?.regne ? "Règne en cours" : "Voter"}</button>
                    </li>
                )
                })}
            </ul>
        </>
    )
}

export default ListeParty