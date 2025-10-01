import { formatSeconds } from "../utils/formatSeconds"

const Leaderboard = ({ data }) => {
  return (
    <section className="w-8/10 lg:w-1/3 flex flex-col gap-3 pt-2 rounded-lg bg-white/90 h-fit min-h-1/2">
      <h1 className="text-xl text-accent font-bold text-center">Leaderboard</h1>
      <table className="w-full">
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Player</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((score, index) => (
            <tr className="border-y-1 border-y-neutral-300 bg-stone-300/50 hover:bg-transparent">
              <td align="center">{index + 1}</td>
              <td align="center">{score.playerName}</td>
              <td align="center">{formatSeconds(score.score)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default Leaderboard
