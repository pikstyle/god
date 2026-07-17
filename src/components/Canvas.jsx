import styles from '../components/Canvas.module.css'
import { useRef, useState, useEffect } from 'react'
import { Rnd } from 'react-rnd'

function Canvas() {

    const testContent = {
        "version": 2,
        "canvas": { "w": 1200, "h": 700 },
        "elements": [
            { "id": "a1", "type": "text",  "x": 400, "y": 10,  "w": 500, "h": 90, "text_content": "TEST ABERRANT", "color": "#ff2600", "size": 64 },
            { "id": "b2", "type": "image", "x": 700, "y": 200, "w": 300, "h": 220, "url": "https://fastly.picsum.photos/id/284/200/200.jpg?hmac=_el2jO-f8UzHfdcTCAXQOD8XX2N6jqVZHwvC23Xm8p8" },
            { "id": "c3", "type": "gif",   "x": 80,  "y": 400, "w": 200, "h": 200, "url": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDBwNXQ4dHR0MTAzYzk0c2x6am1wYWhra2k4dG5iZTdvN3Fva3I3NCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/D63HGAzG15LQrjBPRE/giphy.gif" },
            { "id": "d4", "type": "lien",  "x": 500, "y": 650, "w": 240, "h": 50, "url": "https://discord.gg/Rar6jm48r", "label": "Notre Discord", "color": "#26ff00", "size": 28}
        ]
    }

    const sceneRef = useRef(null)
    const [scale, setScale] = useState(1)
    const [testContentState, setTestContentState] = useState(testContent)
    const recadrage = `scale(${scale})`   // = "scale(0.31)"

    useEffect(() => {
        const mesurer = () => setScale(sceneRef.current.offsetWidth / testContentState.canvas.w)
        mesurer() // une premiere fois au montage
        window.addEventListener('resize', mesurer) // puis a chaque redimensionnement
        return () => window.removeEventListener('resize', mesurer)
    }, [])
    
    function afficherElements(element) {
        switch (element.type) {
            case 'text':
                return <span style={{fontSize: element.size, color: element.color}}>{element.text_content}</span>
            case 'lien':  // check si cest un lien
                if (!element.url.startsWith('http'))  // check si le lien commence par http, sinon on return
                    return null
                return <a draggable={false} style={{fontSize: element.size, color: element.color}} target="_blank" rel="noopener noreferrer" href={element.url}>{element.label}</a> // on retourne un lien avec les bonnes infos, on ouvre le lien dans un nouvel onglet et noopener coupe le lien vers des redirections
            case 'image':
            case 'gif':
                return <img draggable={false} className={styles.media} src={element.url} alt="media-home"/>
            default:
                return <h2>Bug</h2>
            }
        }

    return (
        <div style={{ height: testContentState.canvas.h * scale }} ref={sceneRef} className={styles.scene}>
            <div style={{ transform: recadrage, transformOrigin: 'top left', width: testContentState.canvas.w, height: testContentState.canvas.h }} scale={scale} bounds="parent" className={styles.canva}>
                {/* Avec le map, on place chaque element dans une dive absolute, le porteur, qui porte ce que tout les elements ont en commun. */}
                {testContentState.elements.map((element) => {
                    // dans le map, elle capture l'element de cette itération
                    const deplacer = (event, donnees) => {
                        const nouveauxElements = testContentState.elements.map((truc) => {
                            if (truc.id === element.id) {
                                return { ...truc, x: donnees.x, y: donnees.y }
                            } else {
                                return truc
                            }
                        })
                        setTestContentState({ ...testContentState, elements: nouveauxElements })
                    }
                    return (
                        <Rnd key={element.id} position={{ x: element.x, y: element.y }} size={{ width: element.w, height: element.h }}
                            scale={scale} bounds="parent" onDrag={deplacer} onDragStop={deplacer}>
                            {afficherElements(element)}
                        </Rnd>
                    )
                })}
            </div>
        </div>
    )
}

export default Canvas