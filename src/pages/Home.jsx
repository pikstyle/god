import styles from './Home.module.css'
import { useState, useEffect } from 'react'

function Home({ isLeader, textHome, saveHomeContent, partiLeader, gameState }) {

    const [brouillon, setBrouillon] = useState({})
    const [lienUrl, setLienUrl] = useState("")

    // quand la page publiée arrive, on la recopie dans le brouillon.
    useEffect(() => {
        if (textHome) {
            setBrouillon({...textHome})
        }
    }, [textHome]) // L'effet doit se relancer quand textHome change

    function afficherBloc(bloc, index) {
        if (bloc.type === 'image') { // check si cest une image
            return <img key={index} src={bloc.url} alt="home-image" /> // on retourne une img avec les bonnes infos
        } else if (bloc.type === 'lien') { // check si cest un lien
            return <a key={index} href={bloc.url}>{bloc.label}</a> // on retourne un lien avec les bonnes infos
        }
    }

    return (
        <div className={styles.div_home}>
            <h2>Parti en tête :
                 <span className={styles.leaderName}>{partiLeader?.title}</span>, dirigé par 
                <span className={styles.leaderName}>{partiLeader?.profiles?.username}</span>
            </h2>
            <div className={styles.titre}>{brouillon.text}</div> {/* On affiche le texte que l'user tappe*/}
            {/* Pour chaque media, on appelle afficherBloc, avec son media et son index pour les afficher*/}
            <div>{brouillon.medias?.map((media, index) => afficherBloc(media, index))}</div>

            {/* Éditeur : visible seulement pour le leader, et seulement pendant son règne */}
            {isLeader && gameState?.regne ? 
            <div>
                {/* Texte édité en direct : on copie le brouillon, on ne remplace que le champ text */}
                <input value={brouillon.text} onChange={(e) => setBrouillon({ ...brouillon, text: e.target.value })}/>
                {/* Post-it : retient l'URL tapée, avant de la "poser" sur la page */}
                <input value={lienUrl} onChange={(e) => setLienUrl(e.target.value)}/>
                {/* Pose le lien : ajoute un média au brouillon, puis vide le post-it */}
                <button onClick={() => { setBrouillon({ ...brouillon, medias: [...brouillon.medias, { type: 'lien', url: lienUrl, label: lienUrl }] }); setLienUrl(""); }}>Ajouter un lien</button>
                {/* Retire tous les liens : garde les médias qui ne sont PAS des liens (filter) */}
                <button onClick={() => setBrouillon({ ...brouillon, medias: brouillon.medias?.filter((media) => media.type !== "lien") })}>Supprimer les liens</button>
                {/* Publie : écrit le brouillon en base, il devient la page publique vue par tous */}
                <button onClick={() => saveHomeContent(brouillon)}>Save</button>
                </div>
            : null}
        </div>
    )
}

export default Home