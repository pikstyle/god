function Home({ isLeader, setIsLeader, textHome, setTextHome, saveHomeContent }) {
    return ( // Maj le state localement lors du onChange et avec saveHomeContent(textHome) ecrit dans la base de donnée
        <>
            <input type="checkbox" checked={isLeader} onChange={(e) => setIsLeader(e.target.checked)}/>
            <label>Leader</label>
            {isLeader ? <div><input value={textHome} onChange={(e) => setTextHome(e.target.value)}/> <button onClick={() => saveHomeContent(textHome)}>Save</button></div>: <p>{null}</p>}
            <h1>{textHome}</h1>
        </>
    )
}

export default Home