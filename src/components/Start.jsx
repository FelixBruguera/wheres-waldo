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
        <section className="bg-background h-dvh w-dvw flex flex-col items-center py-3">
            <h1 className="text-2xl font-bold text-accent">Where's Waldo?</h1>
            <div className="flex flex-col gap-10 items-center justify-center h-8/10 w-full">
                {/* <Instructions /> */}
                <Button onClick={onClick}>Start game</Button>
            </div>
        </section>
    )
}

export default Start