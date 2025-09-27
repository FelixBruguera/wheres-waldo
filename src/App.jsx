import { useEffect, useRef, useState } from "react"
import ImageContainer from "./components/ImageContainer"
import DropdownMenu from "./components/DropdownMenu"
import Button from "./components/Button"

const App = () => {
    const [clickCoordinates, setClickCoordinates] = useState(false)
    const onClick = (e) => setClickCoordinates(e.screenX, e.screenY)
    const options = ["Waldo", "Wenda", "Wizard Whitebeard", "Odlaw"]
    const [zoomLevel, setZoomLevel] = useState(1)

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
            </div>
            <ImageContainer zoomLevel={zoomLevel} onClick={(e) => setClickCoordinates([e.pageX, e.pageY])}/>
        </div>
    )
}

export default App