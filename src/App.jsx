import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import CreateParty from './pages/CreateParty'
import PartyList from './pages/PartyList'
import { useState } from 'react'

function App() {
  const [parties, setParties] = useState([]) // Liste des partis

  // Ajouter un parti à la liste des partis
  const addParty = (partyToAdd) => {
    setParties((prev) => {
      return[...prev, partyToAdd]
    })
  }

  console.log(parties)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/create" element={<CreateParty addParty={addParty}/>}/>
        <Route path="/partis" element={<PartyList partyList={parties}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App