import { Link, useParams } from "react-router"
import Button from "./Button"
import ImageContainer from "./ImageContainer"
import { useEffect, useRef, useState } from "react"
import Instructions from "./Instructions"
import Timer from "./Timer"
import Notification from "./Notification"
import Marker from "./Marker"
import GameOver from "./GameOver"

const Game = () => {
    const { id } = useParams()
    const [score, setScore] = useState(false)
    const [playerName, setPlayerName] = useState(false)
    const [clickCoordinates, setClickCoordinates] = useState(false)
    const [markers, setMarkers] = useState([])
    const [startTime, setStartTime] = useState(0)
    const [found, setFound] = useState([])
    const [notification, setNotification] = useState(false)
    useEffect(() => {
        fetch(`/api/games/${id}`)
        .then(response => response.json())
        .then(data => {
            setStartTime(data.gameData.startTime)
            setFound(data.characters)
            setScore(data.gameData.score)
            setPlayerName(data.gameData.playerName)
        })
    }, [])
    const [notificationTimeout, setNotificationTimeout] = useState(null)
    const instructions = useRef(null)
    const checkSelection = async (clientCoords, normalizedCoords) => {
        clearTimeout(notificationTimeout)
        const response = await fetch(`/api/games/${id}`, { method: "POST", body: JSON.stringify({ x: normalizedCoords[0], y: normalizedCoords[1]})})
        const data = await response.json()
        if (response.ok) {
            setFound((prev) => prev.concat(data.found))
            setMarkers((prev) => prev.concat([clientCoords]))
            if (data.status === "finished") {
                return setScore(data.score)
            }
            else {
                setNotification({message: `You've found ${data.found.name}!`, style: "bg-white !text-black"})
            }
        }
        else {
            setClickCoordinates(clientCoords)
            setNotification({ message: data.error })
        }
        setNotificationTimeout(setTimeout(() => setNotification(false), 5000))
    }
    const updateName = async (name) => {
        const response = await fetch(`/api/games/${id}`, { method: "PATCH", body: JSON.stringify({ name: name })})
        const data = await response.json()
        if (response.ok) {
            setPlayerName(data.playerName)
        }
        else {
            setNotification({message: "Something went wrong, try again"})
        }
    }
    if (score > 0) {
        return <GameOver score={score} playerName={playerName} updateName={updateName} />
    }
    return (
        <div className="bg-background w-dvw h-dvh">
            { notification && <Notification content={notification.message} style={notification.style} /> }
            <dialog ref={instructions} className="mx-auto top-30 rounded-lg ">
                <Instructions modal={instructions} found={found} />
            </dialog>
        { clickCoordinates && <Marker position={clickCoordinates} />}
            <nav className="fixed bg-background w-dvw h-12 flex items-center justify-between px-2">
                <Link to="/">
                    <h1 className="text-xl font-bold text-accent">Where's Waldo?</h1>
                </Link>
                <div className="flex items-center justify-evenly w-6/10 lg:w-4/10">
                    <Button onClick={() => instructions.current.showModal()} >
                        Instructions
                    </Button>
                    { startTime !== 0 && <Timer startTime={startTime}/> }
                    <p aria-label="Characters found" title="Characters found"><span className="text-accent font-bold">{found.length}</span> / 4</p>
                </div>
            </nav>
            <ImageContainer markers={markers} onClick={({ client, normalized }) => checkSelection(client, normalized)} />
        </div>
    )
}

export default Game