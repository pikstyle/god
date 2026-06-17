import styles from './PartyList.module.css'

function ListeParty({ partyList, vote, isVoting, profile, user }) {
    return (
        <>
            <ul className={styles.liste}>
                {partyList.map((party) => {
                return (
                    <li className={styles.carte} key={party.id}>
                        <div className={styles.infos}>
                          {/* {party.profiles?.avatar_url && <img src={party.profiles.avatar_url} alt="avatar" referrerPolicy="no-referrer"/>} Photo du créateur si elle existe. referrerPolicy="no-referrer" empêche Google de bloquer l'image */}
                            <img src={party.logo_url} alt="logo-party" />
                            <h2>{party.title}</h2>
                        </div>
                        
                        <p>{party.description}</p>

                        <h3>Nombre de vote = {party.votes}</h3>
                        <h3>Créé par : {party.profiles?.username}</h3>
                        <button onClick={() => vote(party.id)} disabled={isVoting}>Voter</button>
                    </li>
                )
                })}
            </ul>
        </>
    )
}

export default ListeParty