import { useParams } from "react-router"
import Button from "./Button"
import ImageContainer from "./ImageContainer"
import { useEffect, useState } from "react"
import Instructions from "./Instructions"
import DropdownMenu from "./DropdownMenu"
import { formatInTimeZone } from "date-fns-tz"
import { differenceInSeconds } from "date-fns"
import Timer from "./Timer"

const Game = () => {
    const { id } = useParams()
    const [instructionsOpen, setInstructionsOpen] = useState(false)
    const [clickCoordinates, setClickCoordinates] = useState(false)
    const [normalizedCoordinates, setNormalizedCoordinates] = useState(false)
    const [startTime, setStartTime] = useState(0)
    const [found, setFound] = useState(0)
    const options = ["Waldo", "Wenda", "Wizard Whitebeard", "Odlaw"]
    const [zoomLevel, setZoomLevel] = useState(1)
    useEffect(() => {
        fetch(`api/games/${id}`)
        .then(response => response.json())
        .then(data => {
            const serverData = data[0]
            setStartTime(serverData.startTime)
            setFound(serverData.found)
        })
    })
    // const checkSelection = async (character) => {
    //     const response = await fetch("/api/")
    // }
    return (
        <div>
        { clickCoordinates && <DropdownMenu position={clickCoordinates} options={options} onClick={() => setClickCoordinates(false)} />}
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
            </div>
            { instructionsOpen && <Instructions />}
            <ImageContainer zoomLevel={zoomLevel} onClick={({ client, normalized }) => { 
                setClickCoordinates(client)
                setNormalizedCoordinates(normalized)
            }}/>
        </div>
    )
}

export default Game