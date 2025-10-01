import Button from "./Button"
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import Leaderboard from "./Leaderboard"

const Start = () => {
  const navigate = useNavigate()
  const onClick = () => {
    fetch("/api/games", { method: "POST" })
      .then((response) => response.json())
      .then((data) => navigate(`/${data[0].id}`))
  }
  const [leaderboard, setLeaderboard] = useState([])
  useEffect(() => {
    fetch(`api/leaderboard`)
      .then((response) => response.json())
      .then((data) => {
        setLeaderboard(data)
      })
  }, [])
  return (
    <div
      className="w-full h-dvh flex flex-col items-center justify-evenly"
      style={{
        backgroundImage: "url('/blurred-image.jpeg')",
        backgroundSize: "cover",
      }}
    >
      <h1 className="bg-white/90 text-2xl font-bold text-accent p-2 rounded-lg">
        Where's Waldo?
      </h1>
      <Leaderboard data={leaderboard} />
      <Button
        className="bg-accent text-white px-3 py-2 hover:bg-red-800 font-bold"
        onClick={onClick}
      >
        Start game
      </Button>
    </div>
  )
}

export default Start
