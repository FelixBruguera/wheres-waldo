import { useEffect, useRef, useState } from "react"
import ImageContainer from "./components/ImageContainer"
import DropdownMenu from "./components/DropdownMenu"

const App = () => {
    const [clickCoordinates, setClickCoordinates] = useState(false)
    const onClick = (e) => setClickCoordinates(e.screenX, e.screenY)
    const options = ["Waldo", "Wenda", "Wizard Whitebeard", "Odlaw"]

    return (
        <div>
            { clickCoordinates && <DropdownMenu position={clickCoordinates} options={options} onClick={() => setClickCoordinates(false)} />}
            <ImageContainer onClick={(e) => setClickCoordinates([e.clientX, e.clientY])}/>
        </div>
    )
}

export default App