import { addSeconds, differenceInSeconds, format } from "date-fns"
import { useEffect, useState } from "react"

const Timer = ({ startTime }) => {
    const initialDate = new Date(startTime+"Z")
    const initialSecondsElapsed = differenceInSeconds(new Date(), initialDate)
    const [secondsElapsed, setSecondsElapsed] = useState(initialSecondsElapsed)
    const hours = Math.floor(secondsElapsed / 3600);
    const minutes = Math.floor((secondsElapsed % 3600) / 60);
    const seconds = secondsElapsed % 60;

    const hoursToDisplay = String(hours).padStart(2, "0");
    const minutesToDisplay = String(minutes).padStart(2, "0");
    const secondsToDisplay = String(seconds).padStart(2, "0");

    useEffect(() => {
        let interval = null
            interval = setInterval(() => setSecondsElapsed((prev) => prev + 1), 1000)
        return () => clearInterval(interval)
    }, [startTime])
    return (
        <p className="font-bold text-accent" aria-label="Time Elapsed" title="Time Elapsed">{`${hoursToDisplay}:${minutesToDisplay}:${secondsToDisplay}`}</p>
    )
}

export default Timer