import { useNavigate } from "react-router-dom"

function Home({ isLeader, textHome, setTextHome, saveHomeContent, user }) {

    const navigate = useNavigate() 
    
    return ( // Maj le state localement lors du onChange et avec saveHomeContent(textHome) ecrit dans la base de donnée
        <>
            {!user ? <button onClick={() => navigate('/login')}>Entrer</button> : isLeader ? <div><input value={textHome} onChange={(e) => setTextHome(e.target.value)}/> <button onClick={() => saveHomeContent(textHome)}>Save</button></div>: <p>{null}</p>}
            <h1>{textHome}</h1>
        </>
    )
}

export default Home