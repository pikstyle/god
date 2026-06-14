import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import CreateParty from './pages/CreateParty'
import PartyList from './pages/PartyList'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClients'

function App() {
  const [parties, setParties] = useState([]) // Liste des partis
  const [textHome, setTextHome] = useState('')
  const [isLeader, setIsLeader] = useState(false)
  const [user, setUser] = useState(null)

  // Charge les partis depuis Supabase au démarrage
  useEffect(() => {
    const fetchParties = async () => {
      const { data, error } = await supabase.from('parties').select('*') // Attendre la réponse avec await et extrait les deux propriétés en variables séparées
      setParties(data)
    }
    fetchParties() // Lance la fonction
  }, [])

  // Verifie si on est connecté en tant que user
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession() // Vérifie si on est déjà connecté et récupère la connexion en tant que session
      setUser(session?.user) // Maj le state user avec la session
    }
    checkSession() 
  }, [])

  // Liste des partis triées par ordre décroissant de votes
  const sortedParties = [...parties].sort((a, b) => b.votes - a.votes)

  // Ajouter un parti à la liste des partis
  const addParty = async ({ title, description, votes }) => {
    await supabase.from('parties').insert({ title, description, votes }) // Attend et insère le parti dans la table parties de supabase 
    setParties((prev) => { // maj le state local avec le nouveau parti pour que l'affichage se maj sans avoir à recharger les données depuis Supabase
      return[...prev, { title, description, votes }]
    })
  }

  // Retourne un nouveau tableau de parties avec le bon nombre de vote pour le parti correspondant
  const vote = async (partyId) => {
    setParties(parties.map((party) => { // Maj le state local
      if (party.id === partyId) {
        return { ...party, votes: party.votes + 1 } // change seulement le nombre de vote
      } else {
        return party
      }
    }))
    const currentParty = parties.find((p) => p.id === partyId) // Parcours parties et trouve le party dont l'id match
    await supabase.from('parties').update({ votes: currentParty.votes + 1 }).eq('id', partyId) // Envoie à supabse en incrementant la valeur de vote et modifie que la ligne du bon party avec partyId
  }

  // Verifie que sortedParties n'est pas vide et met a jour le leader
  const leader = sortedParties.length !== 0 ? parties[0] : null

  console.log(user)

  return (
    <BrowserRouter>
    <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<Home isLeader={isLeader} setIsLeader={setIsLeader}textHome={textHome} setTextHome={setTextHome}/>}/>
        <Route path="/create" element={<CreateParty addParty={addParty}/>}/>
        <Route path="/parties" element={<PartyList partyList={sortedParties} vote={vote}/>}/>
        <Route path="/login" element={<Login setUser={setUser}/>}/>
        <Route path="/signup" element={<SignUp setUser={setUser}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App