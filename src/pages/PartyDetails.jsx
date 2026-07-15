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

    const partager = async (party) => {
        const url = "https://gameofdemocracy.org/party/" + party.id // Genere l'url par rapport a l'id du party
        try {
            if (navigator.share) { // Check si le navigateur supporte navigator.check
                await navigator.share({ title: party.title, text: "Vote for my party!", url })
            } else {
                navigator.clipboard.writeText(url) // Sinon on copie juste l'url
                alert("Link copied!")
            }
            } catch (error) {
                    console.log(error)
                }
        }

    return (
        <div className={styles.parent}>
            <div className={styles.head}>
                <img className={styles.logo} src={party?.logo_url} alt="logo-party" />
                <div className={styles.identite}>
                    <div className={styles.droite}>
                        <h2>{party?.title}</h2>
                        <h4>Led by {party?.profiles?.username}</h4>
                    </div>
                </div>
                <div className={styles.statsPolitique}>
                    <div className={styles.stat}>
                        <span className={styles.nombre}>#{partyIndex + 1}</span>
                        <h4>out of {nombreDePartis}</h4>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.nombre}>{party?.votes}</span>
                        <h4>votes</h4>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.nombre}>{pourcentageDesVoix}%</span>
                        <h4>of the vote</h4>
                    </div>
                    {partyIndex !== 0 && (
                        <div className={styles.stat}>
                            <span className={styles.nombre}>{voteEcartTrone + 1}</span>
                            <h4>votes from #1</h4>
                        </div>
                    )}
                </div>
                <button className={styles.boutonVote} onClick={ () => partager(party)}>Share</button>
                <button className={styles.boutonVote} onClick={ () => vote(party.id)} disabled={isVoting || gameState?.regne}>Vote</button>
            </div>
            <h2 className={styles.slogan} >"{party?.description}"
            </h2>
            <div className={styles.reste}>
                {party?.description_longue === null ? null : <h3>Platform : </h3>}
                <p className={styles.programme}>{party?.description_longue}</p>
            </div>
        </div>
    )
}

export default PartyDetails