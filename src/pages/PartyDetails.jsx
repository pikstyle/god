import React from "react";
import { useParams } from "react-router-dom";
import styles from "./PartyDetails.module.css";

function PartyDetails({ partyList, vote, isVoting, gameState }) {

    const { id } = useParams() // Recupère l'objet id destructuré en string qui est obtenu par useParams qui le récupère depuis :id de la route path="/party/:id"

    // Definir le bon party ; index et son rang
    const isSameIndex = (party) =>  String(party.id) === id
    const partyIndex = partyList.findIndex(isSameIndex)
    const party = partyList[partyIndex]
    const rang = partyIndex + 1

    // Calculer le nombre de vote total
    const nombreVoteTotal = partyList?.reduce(
        (total, party) => total + party.votes, 0 
    )

    const pourcentageDesVoix = Math.floor((party?.votes / nombreVoteTotal)*100)

    const voteEcartTrone = parseInt(partyList[0]?.votes - party?.votes)
    const nombreDePartis = partyList?.length

    return (
        <div className={styles.parent}>
            <div className={styles.head}>
                <div className={styles.stat1}>
                    <h1>#{partyIndex + 1}</h1>
                    <p>sur {nombreDePartis}</p>
                </div>
                <img className={styles.logo} src={party?.logo_url} alt="logo-party" />
                <div className={styles.identite}>
                    <div className={styles.droite}>
                        <h1>{party?.title}</h1>
                        <h4>Leader : {party?.profiles?.username}</h4>
                    </div>
                </div>
                <div className={styles.statsPolitique}>
                    <div className={styles.stat}>
                        <h2>{party?.votes}</h2> <p>votes</p>
                    </div>
                    <div className={styles.stat}>
                        <h2>{pourcentageDesVoix}%</h2> <p>des voix</p>
                    </div>
                    {partyIndex !== 0 && (
                        <div className={styles.stat}>
                            <h2>{voteEcartTrone + 1}</h2>
                            <p>votes du #1</p>
                        </div>
                    )}
                </div>
                <button className={styles.boutonVote} onClick={ () => vote(party.id)} disabled={isVoting || gameState?.regne}>Voter</button>
            </div>
            <p className={styles.slogan} >"{party?.description}"
            </p>
            <div className={styles.reste}>
                <h3>Programme : </h3>
                <p className={styles.programme}>{party?.description_longue}</p>
            </div>
        </div>
    )
}

export default PartyDetails