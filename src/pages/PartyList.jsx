function ListeParty({ partyList, vote}) {
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
                        <button onClick={() => vote(party.id)}>Voter</button>
                    </li>
                )
                })}
            </ul>
        </>
    )
}

export default ListeParty