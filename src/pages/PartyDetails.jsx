import React from "react";
import { useParams } from "react-router-dom";

function PartyDetails({ partyList }) {

    const { id } = useParams() // Recupère l'objet id destructuré en string qui est obtenu par useParams qui le récupère depuis :id de la route path="/party/:id"

    const isSameIndex = (party) =>  String(party.id) === id
    const partyIndex = partyList.findIndex(isSameIndex)
    const party = partyList[partyIndex]
    const rang = partyIndex + 1

    return (
        <>
            <h1>{party?.title}</h1>
            <h3>Leader : {party?.profiles?.username}</h3>
            <img src={party?.logo_url} alt="logo-party" />
            <p>{party?.description}</p>
            <p>{party?.description_longue}</p>
        </>
    )
}

export default PartyDetails