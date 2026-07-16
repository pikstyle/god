import { useEffect, useState } from "react"
import { supabase } from '../supabaseClients'

function Musee() {

    const [dataMusee, setDataMusee] = useState([])

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
                    <img src={bloc.url} alt="home-image"/> 
                </div> // on retourne une img avec les bonnes infos
        } else if (bloc.type === 'lien') { // check si cest un lien
            if (!bloc.url.startsWith('http')) { // check si le lien commence par http, sinon on return
                return null
            }
            return <a key={index} target="_blank" rel="noopener noreferrer" href={bloc.url}>{bloc.label}</a> // on retourne un lien avec les bonnes infos, on ouvre le lien dans un nouvel onglet et noopener coupe le lien vers des redirections
        }
    }

    return (
        <div>
            <ul>
            {dataMusee.map((ligne) => 
            <li key={ligne.id}>
                {ligne.party_name + ", "}
                {"elected with: " + ligne.nombre_votes + " votes the " + ligne.date_modification}
                {ligne?.contenu?.medias?.map((media, index) => afficherBloc(media, index))}
            </li>)}
            </ul>
        </div>
    )
}

export default Musee