import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import CreateParty from './pages/CreateParty'
import PartyList from './pages/PartyList'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ProtectedRoute from './components/ProtectedRoute'
import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClients'

function App() {
  const [parties, setParties] = useState([]) // Liste des partis
  const [textHome, setTextHome] = useState('')
  const [isLeader, setIsLeader] = useState(false)
  const [user, setUser] = useState(null)
  const [userVote, setUserVote] = useState(null)
  const [isVoting, setIsVoting] = useState(false)
  const isVotingRef = useRef(false) // isVotingRef = { current: false }

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

  // Lit le texte depuis supabase
  useEffect(() => {
    const fetchHomeContent = async () => {
      const { data, error } = await supabase.from('home_content').select('*') // Attendre la réponse avec await et extrait le texte
      setTextHome(data[0]?.content) // Prendre que la première ligne et maj le texte localement et textHome passé en prop à Home
    }
    fetchHomeContent()
  }, [])

  // Charge le vote de l'utilisateur
  useEffect(()  => {
    const fetchUserVote = async () => {
      if (user) { // Verifie si l'user est connecté
        const { data } = await supabase.from('votes').select('*').eq('user_id', user.id) 
        setUserVote(data[0]?.party_id) // si data[0] est undefined alors return juste undefined grace au ? optional chaining
      }
    }
    fetchUserVote()
  }, [user])

  // Sauvegarde le texteHome dans la base de donnée
  const saveHomeContent = async (textContent) => {
    await supabase.from('home_content').update({ content: textContent }).eq('id', 1) // Maj le texte depuis supabase
  }

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
    if (isVotingRef.current) return // on est entrain de voter donc on sort direct
    isVotingRef.current = true // sinon, on met à true le fait qu'on est entrainde voter
    try {
      setIsVoting(true)
      if (!userVote) { // Vérifie si l'user n'a pas encore déjà voté
        // L'user n'a jamais voté
        setParties(parties.map((party) => { // Maj le state local des parties 
          if (party.id === partyId) {
            return { ...party, votes: party.votes + 1 } // change seulement le nombre de vote
          } else {
            return party
          }
        }))
        setUserVote(partyId) // Maj le state local avec le nouveau parti voté
        const currentParty = parties.find((p) => p.id === partyId) // Parcours parties et trouve le party dont l'id match
        await supabase.from('parties').update({ votes: currentParty.votes + 1 }).eq('id', partyId) // Envoie à supabse en incrementant la valeur de vote et modifie que la ligne du bon party avec partyId
        await supabase.from('votes').insert({ user_id: user.id, party_id: partyId }) // insère une nouvelle ligne dans la table votes de supabase avec l'id de l'user et l'id du party pour lequel il a voté
      } else { // L'uer à déjà voté
        const currentVotePartyId = userVote // Id du parti déjà voté
        const currentParty = parties.find((p) => p.id === currentVotePartyId) // Parcours parties et trouve le party dont l'id match (objet complet)
        if (currentVotePartyId === partyId) { // On vote pour le même parti => impossible pour donc return direct
          return
        } else { // On vote pour un nouveau parti
          await supabase.from('parties').update({ votes: currentParty.votes -1 }).eq('id', currentVotePartyId) // Décrémente le nombre de votes de l'ancien parti
          await supabase.from('votes').delete().eq('user_id', user.id) // Supprime le vote de l'user dans la table votes
          const newParty = parties.find((p) => p.id === partyId) // Parcours parties et trouve le party dont l'id match (objet complet)
          await supabase.from('parties').update({ votes: newParty.votes +1 }).eq('id', partyId) // Ajoute le vote sur supabase
          await supabase.from('votes').insert({ user_id: user.id, party_id: partyId }) // Ajoute un nouveau vote dans la table votes avec l'id de l'user et le party id
          setUserVote(partyId) // Maj le state local avec le nouveau parti voté
          setParties(parties.map((party) => { // Retourne un nouveau tableau avec le nombre de vote de chaque partis maj
            if (party.id === currentVotePartyId) { // Check si c'est l'ancien parti voté
              return { ...party, votes: party.votes - 1 } // change seulement le nombre de vote de l'ancien parti voté
            } else if (party.id === partyId ){ // Check si c'est un nouveau id
              return { ...party, votes: party.votes + 1 } // Rajoute le vote dans le nouveau party
            } else { // C'est un autre parti random donc on touche pas
              return party // On retourne le parti tel quel
            }
          }))
        }
        }
    } finally {  
      isVotingRef.current = false // Fin de voter
      setIsVoting(false)
    }
  }  
  // Les éléments dans ProtectedRoute sont ses children et s'affichent seulement si l'user est connecté
  return (
    <BrowserRouter>
    <NavBar user={user}></NavBar>
      <Routes>
        <Route path="/" element={<ProtectedRoute user={user}><Home isLeader={isLeader} setIsLeader={setIsLeader}textHome={textHome} setTextHome={setTextHome} saveHomeContent={saveHomeContent} /></ProtectedRoute>}/>
        <Route path="/create" element={<ProtectedRoute user={user}><CreateParty addParty={addParty}/></ProtectedRoute>}/>
        <Route path="/parties" element={<ProtectedRoute user={user}><PartyList partyList={sortedParties} vote={vote} isVoting={isVoting}/></ProtectedRoute>}/>
        <Route path="/login" element={<Login setUser={setUser}/>}/>
        <Route path="/signup" element={<SignUp setUser={setUser}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App