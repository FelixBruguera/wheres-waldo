import Instructions from "./Instructions"
import Button from "./Button"
import { useNavigate } from "react-router"

const Start = () => {
    const navigate = useNavigate()
    const onClick = () => {
        fetch("/api/games", { method: "POST" })
        .then(response => response.json())
        .then(data => navigate(`/${data[0].id}`) )
    }
    return (
        <div className="absolute flex flex-col gap-3 items-center justify-center w-dvw h-dvh bg-gray-200">
            <Instructions />
            <Button onClick={onClick}>Start game</Button>
        </div>
    )
}

export default Start