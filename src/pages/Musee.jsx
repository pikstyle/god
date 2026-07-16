import { useEffect, useState } from "react"
import { supabase } from '../supabaseClients'
import styles from './Musee.module.css'

function Musee() {

    const [dataMusee, setDataMusee] = useState([])
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    }

    useEffect(() => {
      const fetchMusee = async () => {
        const { data } = await supabase.from('musee').select('*').order('date_modification', { ascending: false })
        setDataMusee(data)
      }
      fetchMusee()
    }, [])

    function afficherBloc(bloc, index) {
        if (bloc.type === 'image') { // check si cest une image
            return <div key={index}>
                    <img className={styles.image} src={bloc.url} alt="home-image"/> 
                </div> // on retourne une img avec les bonnes infos
        } else if (bloc.type === 'lien') { // check si cest un lien
            if (!bloc.url.startsWith('http')) { // check si le lien commence par http, sinon on return
                return null
            }
            return <a key={index} target="_blank" rel="noopener noreferrer" href={bloc.url}>{bloc.label}</a> // on retourne un lien avec les bonnes infos, on ouvre le lien dans un nouvel onglet et noopener coupe le lien vers des redirections
        }
    }

    return (
        <div className={styles.div}>
            <h1>MUSEUM</h1>
            <ul className={styles.ul}>
            {dataMusee.map((ligne) => 
            <li className={styles.li} key={ligne.id}>
                    <div className={styles.contenu}>
                        <span className={styles.textHome}>{ligne.contenu.text}</span>
                        {ligne?.contenu?.medias?.map((media, index) => afficherBloc(media, index))}
                    </div>
                    <div className={styles.infos}>
                        <p>{ligne.party_name}</p>
                        <p>{"Elected with " + ligne.nombre_votes + " votes"}</p>
                        <p>{new Date(ligne.date_modification).toLocaleDateString(undefined, options)}</p>
                    </div>
            </li>)}
            </ul>
        </div>
    )
}

export default Musee