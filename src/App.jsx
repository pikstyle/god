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
import HowItWorks from './pages/HowItWorks'
import PartyDetails from './pages/PartyDetails'
import Footer from './components/Footer'
import Musee from './pages/Musee'
import Cgu from './pages/Cgu'
import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClients'
import styles from './App.module.css'
import Canvas from './components/Canvas'

function App() {
  const [parties, setParties] = useState([]) // Liste des partis
  const [textHome, setTextHome] = useState('')
  const [user, setUser] = useState(null)
  const [userVote, setUserVote] = useState(null)
  const [isVoting, setIsVoting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [gameState, setGameState] = useState(null)
  const [now, setNow] = useState(new Date())
  const [userVoteRev, setUserVoteRev] = useState(false)
  const isVotingRef = useRef(false) // isVotingRef = { current: false }
  const isVotingRevRef = useRef(false) // isVotingRef = { current: false }
  const navigate = useNavigate()
  const location = useLocation()

  // Charge les partis
  useEffect(() => {
    const fetchParties = async () => {
      const { data: partiesData } = await supabase.from('parties').select('*') // Recupere tous les partis depuis supabase et nomme la data partiesData pour eviter conflit de nom
      const { data: profilesData } = await supabase.from('profiles').select('id, username, avatar_url') // Recup tous les profiles depuis supabase mais stocke seulement l'id et username
      const merged = (partiesData ?? []).map(party => ({ // Pour chaque parti, on créé un nouvel objet avec :
        ...party, // toutes les infos du partis
        profiles: (profilesData ?? []).find(p => p.id === party.created_by) // Ajoute une propriété "profiles" a l'objet dont l'id de profiles data = l'id du createur
      }))
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

  // Recuperer le gamestate 
  useEffect(() => {
    const fetchGameState = async () => {
      const { data, error } = await supabase.from('game_state').select('*') // Attendre la réponse avec await et extrait les datas
      setGameState(data[0]) // Prendre la premiere ligne et recuperer le bool regne.
    }
    fetchGameState()
  }, []) // Tableau de dependences vide pour appeller qu'une seule fois. 

  // Charge le vote de l'utilisateur
  useEffect(() => {
    const fetchUserVotes = async () => {
      if (user) { // Verifie si l'user est connecté
        const { data } = await supabase.from('votes').select('*').eq('user_id', user.id)
        const { data: dataRev } = await supabase.from('votes_revolution').select('id').eq('user_id', user.id)
        setUserVote(data[0]?.party_id) // si data[0] est undefined alors return juste undefined grace au ? optional chaining
        setUserVoteRev(dataRev.length > 0)
      }
    }
    fetchUserVotes()
  }, [user, gameState?.regne]) // Lance le fetch quand on change d'user, et quand on change de regne

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

  // Lancer une horloge
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000) // setIntervalle fonction du navigateur qui exécute setNow toutes les 1000 ms
    return () => clearInterval(interval) // Fonction menage pour arreter le timer quand on quitte la page
  }, [])

  // Realtime = actualise tout seul le changement de cycle
  useEffect(() => {
    const canal = supabase
      .channel('check-timer') // ouvre la ligne d'écoute
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state' }, (payload) => setGameState(payload.new)) // ce qu'on écoute, et quoi faire à réception (on filtre l'ecoute seulement pour update et game_state)
      .subscribe() // décroche : la connexion s'établit
    return () => supabase.removeChannel(canal) // Fonction menage pour arreter le canal quand on quitte la page
  }, [])

  // Realtime = actualise tout seul les votes
  useEffect(() => {
    const canalVotes = supabase
      .channel('parties-live')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'parties' }, (payload) => { setParties(prev => prev.map(p => p.id === payload.new.id ? { ...p, votes: payload.new.votes } : p)) }) // ma uniquement les votes du bon parti
      .subscribe()
    return () => supabase.removeChannel(canalVotes)
  }, [])

  // Sauvegarde le texteHome dans la base de donnée
  const saveHomeContent = async (textContent) => {
    const { data, error } = await supabase.from('home_content').update({ content: textContent }).eq('id', 1).select()
    if (error) {
      return error
    }
    if (data.length === 0) { // aucune ligne touchée car la RLS a filtré = pas leader en règne
      return { message: 'Publication refusée : il faut être leader pendant un règne.' }
    }
  }

  // Liste des partis triées par ordre décroissant de votes
  const sortedParties = [...parties].sort((a, b) => b.votes - a.votes)

  // Definir qui est le leader et leader existe ssi user existe, si le parti leader est chargé et si son id = created_by du parti #1
  const isLeader = user && sortedParties[0]?.created_by && user?.id === sortedParties[0]?.created_by
  // Ajouter un parti à la liste des partis
  const addParty = async ({ title, description, votes, logoFile, description_longue }) => {
    const { data: uploadData } = await supabase.storage.from('logos').upload(title, logoFile) // Upload (donc envoie) le logofile au bucket de supabase
    const { data: urlData } = supabase.storage.from('logos').getPublicUrl(title) // Récupère l'URL publique du fichier uploadé (url générée par supabase)
    const { data, error } = await supabase.from('parties').insert({ title, description, votes, created_by: user.id, logo_url: urlData.publicUrl, description_longue }).select() // Attend et insère le parti dans la table parties de supabase 
    if (error) {
      return { error }
    } else {
      setParties((prev) => { // maj le state local avec le nouveau parti pour que l'affichage se maj sans avoir à recharger les données depuis Supabase
        return [...prev, { ...data[0], profiles: { id: user.id, username: profile?.username, avatar_url: profile?.avatar_url } }] // Créé un nouveau tableau avec tout les anciens + le nouveau et met tout ça dans setParties
      })
      return { error: null }
    }

  }

  // Logout
  const logOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  // Sauvegarde le profil de l'user dans la table de profiles de Supabase
  const updateProfile = async ({ username, avatar_url }) => { // Nouveau pseudo, avatar
    await supabase.from("profiles").upsert({ id: user.id, username, avatar_url }) // Si le profil existe deja, il est maj sinon on le crée
    setParties(parties.map(party => { // Actualiser le profile aussi pour partyList
      if (user.id === party.created_by) { // Pour chaque parti crée par l'user
        return { ...party, profiles: { ...party.profiles, username, avatar_url } } // On garde le parti (...party) et on remplace son profiles par une copie de l'ancien (...party.profiles, pour conserver l'id) avec le nouveau pseudo + avatar par-dessus.
      } else {
        return party
      }
    }))
    setProfile({ ...profile, username, avatar_url }) // Update le state localement seulement du pseudo et avatar
  }

  // Le compteur parties.votes est recalculé par un trigger Postgres à chaque insert/delete dans votes. Ici on ne fait qu'ajouter/retirer le vote donc on touche jamais au compteur en base. 
  const vote = async (partyId) => {
    if (!user) {
      navigate('/login') // Si on est pas connecte on va vers login
      return // On sort de la fonction
    }
    if (gameState?.regne) return // Si on est en regne, on ne peut pas voter
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
        await supabase.from('votes').insert({ user_id: user.id, party_id: partyId }) // insère une nouvelle ligne dans la table votes de supabase avec l'id de l'user et l'id du party pour lequel il a voté
      } else { // L'user a déjà voté
        const currentVotePartyId = userVote // Id du parti déjà voté
        if (currentVotePartyId === partyId) { // On vote pour le même parti donc rien à faire
          return
        } else { // On vote pour un nouveau parti
          await supabase.from('votes').delete().eq('user_id', user.id) // Supprime le vote de l'user dans la table votes
          await supabase.from('votes').insert({ user_id: user.id, party_id: partyId }) // Ajoute un nouveau vote dans la table votes avec l'id de l'user et le party id
          setUserVote(partyId) // Maj le state local avec le nouveau parti voté
          setParties(parties.map((party) => { // Retourne un nouveau tableau avec le nombre de vote de chaque partis maj
            if (party.id === currentVotePartyId) { // Check si c'est l'ancien parti voté
              return { ...party, votes: party.votes - 1 } // change seulement le nombre de vote de l'ancien parti voté
            } else if (party.id === partyId) { // Check si c'est un nouveau id
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

  const voteRevolution = async () => {
    if (!user) {
      navigate('/login') // Si on est pas connecte on va vers login
      return // On sort de la fonction
    }
    if (!gameState?.regne) return // Si on est en pas en regne, on ne peut pas voter
    if (isVotingRevRef.current) return // on est entrain de voter donc on sort direct
    isVotingRevRef.current = true // sinon, on met à true le fait qu'on est entrainde voter
    try {
      if (userVoteRev) return // Si on a deja vote pour la revolution alors on sort
      await supabase.from('votes_revolution').insert({ user_id: user.id })
      setUserVoteRev(true)
    } finally {
      isVotingRevRef.current = false
    }
  }

  // Calculer et formatter le timer
  const formatTimer = () => {
    const restant = Math.max(0, (gameState ? new Date(gameState.fin_phase) - now : 0)) // temps restant et Math.max pour eviter d'avoir des negatifs
    const secondesTotales = Math.floor(restant / 1000) // ms en secondes
    const heures = Math.floor(secondesTotales / 3600) // secondes en heures
    const minutes = Math.floor((secondesTotales % 3600) / 60)
    const secondes = secondesTotales % 60
    return `${heures}h ${minutes}m ${secondes}s`
  }

  //  insère une ligne dans announcements, et cet insert déclenche toute la chaîne (annonce_discord => post_to_discord => Discord)
  const sendAnnonce = async (message) => {
    const { error } = await supabase.from('announcements').insert({ message: message, user_id: user.id }) // Insere le message, et l'id de l'user qui a ecrit le message
    console.log(error)
  }
  // Si on est en loading, ou que on a un user mais pas son profile et que on est pas dans onboarding, on ecrit chargement
  if (loading || (user && !profile && location.pathname !== '/onboarding')) {
    return <p>Chargement...</p>
  }

  // Les éléments dans ProtectedRoute sont ses children et s'affichent seulement si l'user est connecté
  return (
    <div className={styles.wrapper} >
      {location.pathname !== "/onboarding" && <NavBar timer={formatTimer()} partiLeader={sortedParties[0]} partyList={sortedParties} gameState={gameState} avatar={profile?.avatar_url} user={user} logout={logOut} loading={loading} username={profile?.username}></NavBar>}
      <div className={styles.page} >
        <Routes>
          <Route path="/" element={<Home sendAnnonce={sendAnnonce} gameState={gameState} user={user} isLeader={isLeader} partiLeader={sortedParties[0]} textHome={textHome} setTextHome={setTextHome} saveHomeContent={saveHomeContent} />} />
          <Route path="/create" element={<ProtectedRoute loading={loading} user={user}><CreateParty addParty={addParty} /></ProtectedRoute>} />
          <Route path="/parties" element={<PartyList userVoteRev={userVoteRev} voteRevolution={voteRevolution} partiLeader={sortedParties[0]} timer={formatTimer()} gameState={gameState} partyList={sortedParties} vote={vote} isVoting={isVoting} profile={profile} user={user} />} />
          <Route path="/profile" element={<ProtectedRoute loading={loading} user={user}><Profile logout={logOut} updateProfile={updateProfile} user={user} profile={profile}></Profile></ProtectedRoute>} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<SignUp setUser={setUser} />} />
          <Route path="/onboarding" element={<ProtectedRoute loading={loading} user={user}><Onboarding user={user} profile={profile} updateProfile={updateProfile} /></ProtectedRoute>} />
          <Route path="/hiw" element={<HowItWorks />} />
          <Route path="/party/:id" element={<PartyDetails partyList={sortedParties} isVoting={isVoting} vote={vote} gameState={gameState} />} />
          <Route path="/cgu" element={<Cgu></Cgu>} />
          <Route path="/museum" element={<Musee></Musee>} />
          <Route path="/editor-debug" element={textHome ? <Canvas user={user} editable={true} content={textHome} onSave={saveHomeContent} editable={true}/> : null} />
        </Routes>
      </div>
      {location.pathname !== "/" && <Footer />} {/*Pour pas afficher dans home*/}
    </div>
  )
}

export default App