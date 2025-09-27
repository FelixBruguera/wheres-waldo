import { useEffect, useRef, useState } from "react"
import ImageContainer from "./components/ImageContainer"
import DropdownMenu from "./components/DropdownMenu"
import Button from "./components/Button"
import Instructions from "./components/Instructions"
import { Route, Routes } from "react-router"
import Start from "./components/Start"

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
        </Routes>
        // <div>
        //     {!gameId ? (
        //         <div className="absolute flex flex-col gap-3 items-center justify-center w-dvw h-dvh bg-gray-200">
        //             <Instructions />
        //             <Button>Start game</Button>
        //         </div>)
        //     :
        //     <>
        //     { clickCoordinates && <DropdownMenu position={clickCoordinates} options={options} onClick={() => setClickCoordinates(false)} />}
        //     <div className="flex items-center justify-evenly p-1">
        //         <Button onClick={() => setZoomLevel(1)} isActive={zoomLevel === 1} >
        //             Zoom 100%
        //         </Button>
        //         <Button onClick={() => setZoomLevel(2)} isActive={zoomLevel === 2} >
        //             Zoom 150%
        //         </Button>
        //         <Button onClick={() => setZoomLevel(3)} isActive={zoomLevel === 3} >
        //             Zoom 200%
        //         </Button>
        //     </div>
        //     <ImageContainer zoomLevel={zoomLevel} onClick={({ client, normalized }) => { 
        //         setClickCoordinates(client)
        //         setNormalizedCoordinates(normalized)
        //     }}/>
        //     </>}
        // </div>
    )
}

export default App