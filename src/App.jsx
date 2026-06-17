import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import CreateParty from './pages/CreateParty'
import PartyList from './pages/PartyList'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Onboarding from './pages/Onboarding'
import ProtectedRoute from './components/ProtectedRoute'
import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClients'

function App() {
  const [parties, setParties] = useState([]) // Liste des partis
  const [textHome, setTextHome] = useState('')
  const [user, setUser] = useState(null)
  const [userVote, setUserVote] = useState(null)
  const [isVoting, setIsVoting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const isVotingRef = useRef(false) // isVotingRef = { current: false }
  const navigate = useNavigate()
  const location = useLocation()

  // Charge les partis
  useEffect(() => {
    const fetchParties = async () => {
      const { data: partiesData } = await supabase.from('parties').select('*') // Recupere tous les partis depuis supabase et nomme la data partiesData pour eviter conflit de nom
      const { data: profilesData } = await supabase.from('profiles').select('id, username, avatar_url') // Recup tous les profiles depuis supabase mais stocke seulement l'id et username
      const merged = (partiesData ?? []).map(party => ({ // Pour chaque parti, on créé un nouvel objet avec :
        ...party, // toutes les infos du partis
        profiles: profilesData.find(p => p.id === party.created_by) // Ajoute une propriété "profiles" a l'objet dont l'id de profiles data = l'id du createur
      }))
      console.log(merged)
      setParties(merged ?? []) // Met a jour le state avec le tableau fusionné, le ?? [] protège si merged est null comme ça on crash pas
    }
    fetchParties() // Lance la fonction
  }, [])

  // Fonction de la librairie Supabase. Ecoute en temps réel tous les changements d'auth (login email, OAuth, logout, expiration). Il se déclenche automatiquement après chaque redirect OAuth.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => { // Retourne un objet qu'on destructure en subscription, retournée à chaque changement
      setUser(session?.user ?? null) // session => contient la nouvelle session. Si aucune session alors user devient null
      setLoading(false) // On arrete le loading pour débloquer ProtectedRoute
    })
    return () => subscription.unsubscribe() // Arreter d'ecouter 
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

    // Recuperer le profile de l'user depuis supabase
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return // évite de faire la requête si user n'est pas encore chargé
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id) // Récupère la ligne dans la table profiles où id = user.id
            setProfile(data[0]) // Stocke le profile et maj le state
            if (!data[0]) { // Si l'user n'a pas de profile, go onboard
              navigate('/onboarding')
      }
        }
        fetchProfile()
    }, [user])

  // Sauvegarde le texteHome dans la base de donnée
  const saveHomeContent = async (textContent) => {
    await supabase.from('home_content').update({ content: textContent }).eq('id', 1) // Maj le texte depuis supabase
  }

  // Liste des partis triées par ordre décroissant de votes
  const sortedParties = [...parties].sort((a, b) => b.votes - a.votes)

  // Definir qui est le leader
  const isLeader = user?.id === sortedParties[0]?.created_by

  // Ajouter un parti à la liste des partis
  const addParty = async ({ title, description, votes, logoFile }) => {
    const { data: uploadData } = await supabase.storage.from('logos').upload(title, logoFile) // Upload (donc envoie) le logofile au bucket de supabase
    const { data: urlData } = supabase.storage.from('logos').getPublicUrl(title) // Récupère l'URL publique du fichier uploadé (url générée par supabase)
    const { data } = await supabase.from('parties').insert({ title, description, votes, created_by: user.id, logo_url: urlData.publicUrl }).select() // Attend et insère le parti dans la table parties de supabase 
    setParties((prev) => { // maj le state local avec le nouveau parti pour que l'affichage se maj sans avoir à recharger les données depuis Supabase
      return [...prev, { ...data[0], profiles: { id: user.id, username: profile?.username, avatar_url: profile?.avatar_url } }] // Créé un nouveau tableau avec tout les anciens + le nouveau et met tout ça dans setParties
    })
  }

  // Logout
  const logOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  // Sauvegarde le profil de l'user dans la table de profiles de Supabase
  const updateProfile = async ( {username, avatar_url} ) => { // Nouveau pseudo, avatar
    const { data } = await supabase.from("profiles").upsert({ id: user.id, username, avatar_url }) // Si le profil existe deja, il est maj sinon on le crée
    setProfile({ ...profile, username, avatar_url }) // Update le state localement seulement du pseudo
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
      } else { // L'user a déjà voté
        const currentVotePartyId = userVote // Id du parti déjà voté
        const currentParty = parties.find((p) => p.id === currentVotePartyId) // Parcours parties et trouve le party dont l'id match (objet complet)
        if (currentVotePartyId === partyId) { // On vote pour le même parti donc rien à faire
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
    <>
      {user && location.pathname !== "/onboarding" && <NavBar user={user} logout={logOut} loading={loading} username={profile?.username}></NavBar>}
        <Routes>
          <Route path="/" element={<Home user={user} isLeader={isLeader} textHome={textHome} setTextHome={setTextHome} saveHomeContent={saveHomeContent}/>}/>
          <Route path="/create" element={<ProtectedRoute loading={loading} user={user}><CreateParty addParty={addParty}/></ProtectedRoute>}/>
          <Route path="/parties" element={<ProtectedRoute loading={loading} user={user}><PartyList partyList={sortedParties} vote={vote} isVoting={isVoting} profile={profile} user={user}/></ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute loading={loading} user={user}><Profile updateProfile={updateProfile} user={user} profile={profile}></Profile></ProtectedRoute>}/>
          <Route path="/login" element={<Login setUser={setUser}/>}/>
          <Route path="/signup" element={<SignUp setUser={setUser}/>}/>
          <Route path="/onboarding" element={<ProtectedRoute loading={loading} user={user}><Onboarding user={user} profile={profile} updateProfile={updateProfile}/></ProtectedRoute>}/>
        </Routes>
      </>
  )
}

export default App