import styles from '../components/Canvas.module.css'
import { useRef, useState, useEffect } from 'react'
import { Rnd } from 'react-rnd'
import { supabase } from '../supabaseClients'
import imageCompression from 'browser-image-compression'
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

const testContent = {
    "version": 2,
    "canvas": { "w": 1200, "h": 700 },
    "elements": [
        { "id": "a1", "type": "text", "x": 400, "y": 10, "w": 500, "h": 90, "text_content": "TEST ABERRANT", "color": "#ff2600", "size": 64 },
        { "id": "b2", "type": "image", "x": 700, "y": 200, "w": 300, "h": 220, "url": "https://fastly.picsum.photos/id/284/200/200.jpg?hmac=_el2jO-f8UzHfdcTCAXQOD8XX2N6jqVZHwvC23Xm8p8" },
        { "id": "c3", "type": "gif", "x": 80, "y": 400, "w": 200, "h": 200, "url": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDBwNXQ4dHR0MTAzYzk0c2x6am1wYWhra2k4dG5iZTdvN3Fva3I3NCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/D63HGAzG15LQrjBPRE/giphy.gif" },
        { "id": "d4", "type": "lien", "x": 500, "y": 650, "w": 240, "h": 50, "url": "https://discord.gg/Rar6jm48r", "label": "Notre Discord", "color": "#26ff00", "size": 28 }
    ]
}

function Canvas({ user, editable, content = testContent, onSave, sendAnnonce }) {

    const sceneRef = useRef(null)
    const [scale, setScale] = useState(1)
    const [brouillon, setBrouillon] = useState(content)
    const [selectedId, setSelectedId] = useState(null)
    const recadrage = `scale(${scale})`   // = "scale(0.31)"
    const isSubmittingRef = useRef(false)
    const [isSubmitting, setIsSubmitting] = useState(false) // State pour savoir si on submit une image
    const [messageSave, setMessageSave] = useState(null)
    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
    }
    const fileInputRef = useRef(null)
    const gf = new GiphyFetch('rS3kFALE4PpPUODOk5ZBGWlTKF5lKoI1')
    const [messageDiscord, setMessageDiscord] = useState("")

    // Afficher les gifs, trending de base et sinon on affiche ce qu'on recherche
    const fetchGifs = (offset) => {
        if (rechercheGif === '') {
            return gf.trending({ offset, limit: 10 })
        } else {
            return gf.search(rechercheGif, { offset, limit: 10 })
        }
    }
    const [ouvrirGif, setOuvrirGif] = useState(false)
    const [rechercheGif, setRechercheGif] = useState('')

    const poignee = {
        width: 12,
        height: 12,
        background: 'var(--background)',
        border: '1px solid var(--text)',
    }

    const couleurs = [
        '#000000',
        '#ff2600',
        '#0000ff',
        '#26ff00',
        '#ffee00',
        '#ff8800',
        '#8800ff',
        '#ff00aa',
        '#ffffff'
    ]

    const handleSubmit = async (file) => {
        if (isSubmittingRef.current) return // On est entrainde submit donc on sort direct
        isSubmittingRef.current = true  // On est entrain submit 
        try {
            setIsSubmitting(true)
            const compressedFile = await imageCompression(file, options) // Image file est compress
            const chemin = `${user.id}/${Date.now()}`  // Chemin de fichier different a chaque upload
            const { data: uploadData, error: uploadError } = await supabase.storage.from('image_home').upload(chemin, compressedFile) // Upload l'image dans le bucket image_home
            if (uploadError) { // Si l'upload échoue (RLS, fichier trop lourd...), on prévient et on sort sans sauvegarder une URL cassée
                alert('Upload échoué: ' + uploadError.message)
                return
            }
            const { data: urlData } = supabase.storage.from('image_home').getPublicUrl(chemin) // Récupère l'URL publique du fichier uploadé (url générée par supabase)
            ajouterImage(urlData.publicUrl)
        } finally {
            isSubmittingRef.current = false
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        const mesurer = () => setScale(sceneRef.current.offsetWidth / brouillon.canvas.w)
        mesurer() // une premiere fois au montage
        window.addEventListener('resize', mesurer) // puis a chaque redimensionnement
        return () => window.removeEventListener('resize', mesurer)
    }, [])

    function afficherElements(element) {
        switch (element.type) {
            case 'text':
                return <span style={{ fontSize: element.size, color: element.color }}>{element.text_content}</span>
            case 'lien':  // check si cest un lien
                if (!element.url.startsWith('http'))  // check si le lien commence par http, sinon on return
                    return null
                return <a onClick={(e) => { if (editable) e.preventDefault() }} draggable={false} style={{ fontSize: element.size, color: element.color }} target="_blank" rel="noopener noreferrer" href={element.url}>{element.label}</a> // on retourne un lien avec les bonnes infos, on ouvre le lien dans un nouvel onglet et noopener coupe le lien vers des redirections
            case 'image':
            case 'gif':
                return <img draggable={false} className={styles.media} src={element.url} alt="media-home" />
            default:
                return <h2>Bug</h2>
        }
    }

    const supprimerElement = () => {
        setBrouillon({
            ...brouillon,
            elements: brouillon.elements.filter((truc) => truc.id !== selectedId) // On garde tout les elements sauf celui selectionné
        })
        setSelectedId(null)
    }

    const modifierSelection = (changements) => {
        const nouveauxElements = brouillon.elements.map((truc) => {
            if (truc.id === selectedId) {
                return { ...truc, ...changements }
            } else {
                return truc
            }
        })
        setBrouillon({ ...brouillon, elements: nouveauxElements })
    }

    const ajouterElement = (type) => {
        let nouvelElement = { id: crypto.randomUUID(), type: type, x: 450, y: 320, w: 300, h: 60 }
        if (type === 'text') {
            nouvelElement = { ...nouvelElement, text_content: 'Nouveau texte', color: '#000000', size: 32 }
        } else if (type === 'lien') {
            nouvelElement = { ...nouvelElement, url: 'https://', label: 'Nouveau lien', color: '#000000', size: 20, h: 50 }
        }
        setBrouillon({ ...brouillon, elements: [...brouillon.elements, nouvelElement] })
        setSelectedId(nouvelElement.id)
    }

    const ajouterImage = (url) => {
        let nouvelleImage = { id: crypto.randomUUID(), type: 'image', url: url, x: 450, y: 320, w: 300, h: 300 }
        setBrouillon({ ...brouillon, elements: [...brouillon.elements, nouvelleImage] })
        setSelectedId(nouvelleImage.id)
    }

    const ajouterGif = (url) => {
        let nouvelleImage = { id: crypto.randomUUID(), type: 'gif', url: url, x: 450, y: 320, w: 300, h: 300 }
        setBrouillon({ ...brouillon, elements: [...brouillon.elements, nouvelleImage] })
        setSelectedId(nouvelleImage.id)
    }

    const elementSelectionne = brouillon.elements.find(element => element.id === selectedId)

    return (
        <div className={styles.all}>
            <div className={styles.scene} style={{ height: brouillon.canvas.h * scale }} ref={sceneRef}>
                <div className={styles.canva} style={{ transform: recadrage, transformOrigin: 'top left', width: brouillon.canvas.w, height: brouillon.canvas.h }} onClick={(e) => { if (e.target === e.currentTarget) setSelectedId(null) }} >
                    {brouillon.elements.map((element) => {
                        // dans le map, elle capture l'element de cette itération
                        const deplacer = (event, donnees) => {
                            const nouveauxElements = brouillon.elements.map((truc) => {
                                if (truc.id === element.id) {
                                    return { ...truc, x: donnees.x, y: donnees.y }
                                } else {
                                    return truc
                                }
                            })
                            setBrouillon({ ...brouillon, elements: nouveauxElements })
                        }
                        const redimensionner = (event, direction, ref, delta, position) => {
                            const nouveauxElements = brouillon.elements.map((truc) => {
                                if (truc.id === element.id) {
                                    return { ...truc, x: position.x, y: position.y, w: ref.offsetWidth, h: ref.offsetHeight }
                                } else {
                                    return truc
                                }
                            })
                            setBrouillon({ ...brouillon, elements: nouveauxElements })
                        }
                        // Bound parent pour eviter de depasser du canva
                        if (editable) {
                            return (
                                <Rnd onDragStart={() => setSelectedId(element.id)} onResizeStart={() => setSelectedId(element.id)} key={element.id} position={{ x: element.x, y: element.y }} size={{ width: element.w, height: element.h }}
                                    scale={scale} bounds="parent" onDrag={deplacer} onDragStop={deplacer} onResize={redimensionner} onResizeStop={redimensionner} style={{ border: selectedId === element.id ? '1px dashed var(--text)' : '1px dashed transparent' }} enableResizing={selectedId === element.id} resizeHandleStyles={{
                                        topLeft: { ...poignee, left: -6, top: -6 },
                                        topRight: { ...poignee, right: -6, top: -6 },
                                        bottomLeft: { ...poignee, left: -6, bottom: -6 },
                                        bottomRight: { ...poignee, right: -6, bottom: -6 },
                                    }}>
                                    {afficherElements(element)}
                                </Rnd>
                            )
                        } else {
                            return (
                                <div key={element.id} style={{ position: 'absolute', left: element.x, top: element.y, width: element.w, height: element.h }}>
                                    {afficherElements(element)}
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
            {editable && <div className={styles.panneau}>
                <button onClick={() => ajouterElement('text')}>+Text</button>
                <button onClick={() => ajouterElement('lien')}>+Lien</button>
                {selectedId && <button onClick={supprimerElement}>Supprimer</button>}
                {elementSelectionne?.type === 'text' && <input value={elementSelectionne.text_content} type="text" onChange={(e) => modifierSelection({ text_content: e.target.value })} />}
                {elementSelectionne?.type === 'lien' && <input value={elementSelectionne.url} type="text" onChange={(e) => modifierSelection({ url: e.target.value })} />}
                {elementSelectionne?.type === 'lien' && <input value={elementSelectionne.label} type="text" onChange={(e) => modifierSelection({ label: e.target.value })} />}
                {elementSelectionne?.type === 'lien' && couleurs.map((couleur) => (
                    <button key={couleur} className={styles.pastilles} style={{ backgroundColor: couleur }} onClick={() => modifierSelection({ color: couleur })}></button>
                ))}
                {elementSelectionne?.type === 'text' && couleurs.map((couleur) => (
                    <button key={couleur} className={styles.pastilles} style={{ backgroundColor: couleur }} onClick={() => modifierSelection({ color: couleur })}></button>
                ))}
                {elementSelectionne?.type === 'text' && <input value={elementSelectionne.size} type="number" onChange={(e) => modifierSelection({ size: Number(e.target.value) })} />}
                {elementSelectionne?.type === 'lien' && <input value={elementSelectionne.size} type="number" onChange={(e) => modifierSelection({ size: Number(e.target.value) })} />}
                <input ref={fileInputRef} required type="file" onChange={(e) => handleSubmit(e.target.files[0])} />
                <button onClick={() => setOuvrirGif(!ouvrirGif)}>gifs</button>
                {ouvrirGif && <input type="text" onChange={(e) => setRechercheGif(e.target.value)} />}
                {ouvrirGif && <Grid key={rechercheGif} width={600} columns={3} fetchGifs={fetchGifs} onGifClick={((gif, e) => {
                    ajouterGif(gif.images.fixed_height.url), e.preventDefault()
                })} />}
                <input type="text" value={messageDiscord} onChange={(e) => setMessageDiscord(e.target.value)} placeholder='Faire une annonce discord'/>
                {/* Bouton envoyer discord annonces */}
                <button onClick={() => {
                    if (messageDiscord === '') {
                        alert("Veuillez inclure un message")
                        return 
                    }
                    sendAnnonce(messageDiscord), setMessageDiscord("")}}>Envoyer sur discord</button>
                {<button onClick={async () => {
                    const erreur = await onSave(brouillon)
                    if (erreur) {
                        setMessageSave('Échec : ' + erreur.message)
                    } else {
                        setMessageSave('Publié !')
                    }
                }}>Publier</button>}
                {messageSave && <span>{messageSave}</span>}

            </div>}
        </div>
    )
}

export default Canvas