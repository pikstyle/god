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
                        <img src={URL.createObjectURL(party.logo)} alt="logo-party" />
                        <h3>Nombre de vote = {party.vote}</h3>
                        <button onClick={() => vote(party.id)}>Voter</button>
                    </li>
                )
                })}
            </ul>
        </>
    )
}

export default ListeParty