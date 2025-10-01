import { Link } from "react-router"
import { formatSeconds } from "../utils/formatSeconds"
import Button from "./Button"
import { useState } from "react"
import Notification from "./Notification"

const GameOver = ({ score, playerName, updateName, notification }) => {
    const [inputText, setInputText] = useState("")
    const wrapperClass = "bg-white/85 h-fit w-fit px-10 lg:px-15 py-7 rounded-md mx-auto flex flex-col gap-3 items-center justify-center"
    const Wrapper = playerName ? "div" : "form"
    const handleSubmit = (e) => {
        e.preventDefault()
        updateName(inputText)
    }

    return (
        <div className="w-full h-dvh flex items-center justify-center" style={{backgroundImage: "url('/image.jpeg')", backgroundSize: "cover"}}>
            { (!playerName && notification) && <Notification content={notification.message} style={notification.style} /> }
            <Wrapper className={wrapperClass} onSubmit={!playerName ? handleSubmit : undefined}>
                <h1 className="text-3xl text-accent font-bold">You've found them all!</h1>
                <p>Your time: <span className="text-accent">{formatSeconds(score)}</span></p>
                {
                    playerName 
                    ? <p className="font-bold">{playerName}</p> 
                    : <input type="text" id="name" name="name" value={inputText} onChange={(e) => setInputText(e.target.value)} minLength="3" maxLength="20" placeholder="Claim your time" required className="px-2 bg-stone-300 border-1 border-stone-400 rounded-lg"/>
                }
                <div className="flex items-center justify-evenly w-full">
                    { !playerName && <Button type="submit" className="bg-accent hover:bg-red-800 text-white">Save</Button> }
                    <Link to="/"><Button type="button" className="border-1 border-zinc-400">Leaderboard</Button></Link>
                </div>
            </Wrapper>
        </div>
    )
}

export default GameOver