function ListeParty({ partyList, vote, isVoting, profile, user }) {
    return (
        <>
            <h1>Liste des partis</h1>
            <ul>
                {partyList.map((party) => {
                return (
                    <li key={party.id}>
                        <h2>{party.title}</h2>
                        <p>{party.description}</p>
                        <img src={party.logo_url} alt="logo-party" />
                        <h3>Nombre de vote = {party.votes}</h3>
                        <h3>Créé par : {party.profiles?.username}</h3>
                        <img src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt="avatar"/>
                        <button onClick={() => vote(party.id)} disabled={isVoting}>Voter</button>
                    </li>
                )
                })}
            </ul>
        </>
    )
}

export default ListeParty