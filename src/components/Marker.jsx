const Marker = ({ position, isFound }) => {
  return (
    <div
      data-testid="marker"
      className={`absolute size-20 border-10 rounded-4xl ${isFound ? "border-white" : "border-accent"}`}
      style={{
        left: `${position[0] - 30}px`,
        top: `${position[1] - 30}px`,
      }}
    ></div>
  )
}

export default Marker
