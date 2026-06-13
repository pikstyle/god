import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import CreateParty from './pages/CreateParty'
import PartyList from './pages/PartyList'
import { useState } from 'react'
import NavBar from './components/NavBar'

function App() {
  const [parties, setParties] = useState([]) // Liste des partis
  const [textHome, setTextHome] = useState('')
  const [isLeader, setIsLeader] = useState(false)

  // Ajouter un parti à la liste des partis
  const addParty = (partyToAdd) => {
    setParties((prev) => {
      return[...prev, partyToAdd]
    })
  }
  // Retourne un nouveau tableau de parties avec le bon nombre de vote pour le parti correspondant
  const vote = (partyId) => {
    setParties(parties.map((party) => {
      if (party.id === partyId) {
        return { ...party, vote: party.vote + 1 } // change seulement le nombre de vote
      } else {
        return party
      }
    }))
  }

  return (
    <BrowserRouter>
    <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<Home isLeader={isLeader} setIsLeader={setIsLeader}textHome={textHome} setTextHome={setTextHome}/>}/>
        <Route path="/create" element={<CreateParty addParty={addParty}/>}/>
        <Route path="/parties" element={<PartyList partyList={parties} vote={vote}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App