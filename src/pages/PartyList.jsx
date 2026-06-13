import { Link } from "react-router-dom"

function ListeParty( {partyList} ) {
    return (
        <>
            <Link to="/create">Créer un parti</Link>
            <h1>Liste des partis</h1>
            {partyList.map((party) => {
               return (
                <div>
                    <h2>{party.title}</h2>
                    <p>{party.description}</p>
                    <img src={URL.createObjectURL(party.logo)} alt="logo-party" />
                </div>
               )
            })}
        </>
    )
}

export default ListeParty