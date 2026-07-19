import { useEffect, useState } from "react"
import { supabase } from '../supabaseClients'
import styles from './Musee.module.css'
import Canvas from '../components/Canvas'


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

    return (
        <div className={styles.div}>
            <h1>MUSEUM</h1>
            <ul className={styles.ul}>
            {dataMusee.map((ligne) => 
            <li className={styles.li} key={ligne.id}>
                <Canvas content={ligne.contenu} editable={false}></Canvas>
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