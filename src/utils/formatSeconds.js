export const formatSeconds = (totalSeconds) => {
  if (!totalSeconds || totalSeconds < 0) {
    return "00:00:00"
  }

  const safeTotalSeconds = Math.floor(totalSeconds)
  const hours = Math.floor(safeTotalSeconds / 3600)
  const minutes = Math.floor((safeTotalSeconds % 3600) / 60)
  const seconds = safeTotalSeconds % 60
  const hoursToDisplay = String(hours).padStart(2, "0")
  const minutesToDisplay = String(minutes).padStart(2, "0")
  const secondsToDisplay = String(seconds).padStart(2, "0")

  return `${hoursToDisplay}:${minutesToDisplay}:${secondsToDisplay}`
}