import { useState } from "react"
import { Route, Routes } from "react-router"
import Start from "./components/Start"
import Game from "./components/Game"

const App = () => {
    const [gameId, setGameId] = useState(false)
    const [clickCoordinates, setClickCoordinates] = useState(false)
    const [normalizedCoordinates, setNormalizedCoordinates] = useState(false)
    const options = ["Waldo", "Wenda", "Wizard Whitebeard", "Odlaw"]
    const [zoomLevel, setZoomLevel] = useState(1)
    // const checkSelection = async (character) => {
    //     const response = await fetch("/api/")
    // }

    return (
        <Routes>
            <Route index={true} element={<Start />} />
            <Route path="/:id" element={<Game />} />
        </Routes>
    )
}

export default App