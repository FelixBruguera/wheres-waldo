import { Link, useParams } from "react-router"
import Button from "./Button"
import ImageContainer from "./ImageContainer"
import { useEffect, useState } from "react"
import Instructions from "./Instructions"
import DropdownMenu from "./DropdownMenu"
import { formatInTimeZone } from "date-fns-tz"
import { differenceInSeconds } from "date-fns"
import Timer from "./Timer"
import Notification from "./Notification"

const Game = () => {
    const { id } = useParams()
    const [score, setScore] = useState(false)
    const [instructionsOpen, setInstructionsOpen] = useState(false)
    const [clickCoordinates, setClickCoordinates] = useState(false)
    const [normalizedCoordinates, setNormalizedCoordinates] = useState(false)
    const [startTime, setStartTime] = useState(0)
    const [characters, setCharacters] = useState([])
    const [zoomLevel, setZoomLevel] = useState(1)
    const [notification, setNotification] = useState(false)
    useEffect(() => {
        fetch(`api/games/${id}`)
        .then(response => response.json())
        .then(data => {
            setStartTime(data.gameData.startTime)
            setCharacters(data.characters)
            setScore(data.gameData.score)
        })
    }, [])
    const checkSelection = async (character) => {
        const response = await fetch(`/api/games/${id}`, { method: "PATCH", body: JSON.stringify({ x: normalizedCoordinates[0], y: normalizedCoordinates[1], characterId: character.id, characterName: character.name})})
        if (response.ok) {
            const data = await response.json()
            if (data.status === "finished") {
                setScore(data.scoreInSeconds)
            }
            else {
                setNotification(`You've found ${data.found.name}!`)
                setTimeout(() => setNotification(false), 5000)
            }
            setCharacters((prev) => prev.filter(char => char.id !== data.found.characterId))
        }
        else {
            setNotification(`Wrong guess`)
            setTimeout(() => setNotification(false), 5000)
        }

        setClickCoordinates(false)
    }
    const found = 4 - characters.length
    if (score > 0) {
        return (
            <div>
                <h1>You've found them all!</h1>
                <p>Your score: {score}</p>
                <Link to="/"><Button>Play again</Button></Link>
            </div>
        )
    }
    return (
        <div className="bg-gray-100">
            { notification && <Notification content={notification} /> }
            <dialog open={instructionsOpen} className="m-auto mt-30">
                <div className="w-full flex flex-col items-end p-2">
                    <Button onClick={() => setInstructionsOpen(false)}>Close</Button>
                    <Instructions />
                </div>
            </dialog>
        { clickCoordinates && <DropdownMenu position={clickCoordinates} characters={characters} onClick={checkSelection} />}
            <div className="flex items-center justify-evenly p-1">
                <Button onClick={() => setZoomLevel(1)} isActive={zoomLevel === 1} >
                    Zoom 100%
                </Button>
                <Button onClick={() => setZoomLevel(2)} isActive={zoomLevel === 2} >
                    Zoom 150%
                </Button>
                <Button onClick={() => setZoomLevel(3)} isActive={zoomLevel === 3} >
                    Zoom 200%
                </Button>
                <Button onClick={() => setInstructionsOpen((prev) => !prev)} isActive={instructionsOpen} >
                    Instructions
                </Button>
                { startTime !== 0 && <Timer startTime={startTime}/> }
                <p>Found <span className="text-accent font-bold">{found}</span> out of 4</p>
            </div>
            <ImageContainer zoomLevel={zoomLevel} onClick={({ client, normalized }) => { 
                setClickCoordinates(client)
                setNormalizedCoordinates(normalized)
                console.log(normalized)
            }}/>
        </div>
    )
}

export default Game