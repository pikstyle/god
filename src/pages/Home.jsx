import { Link } from 'react-router-dom'

function Home({ isLeader, setIsLeader, textHome, setTextHome }) {
    return (
        <>
            <input type="checkbox" checked={isLeader} onChange={(e) => setIsLeader(e.target.checked)}/>
            <label>Leader</label>
            {isLeader ? <div><input value={textHome} onChange={(e) => setTextHome(e.target.value)}/></div>: <p>{null}</p>} 
            <Link to="/create">Entrer</Link>
            <h1>{textHome}</h1>
        </>
    )
}

export default Home