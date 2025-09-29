import Marker from "./Marker"

const ImageContainer = ({ onClick, markers }) => {
    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const normalizedX = x / rect.width
        const normalizedY = y / rect.height
        onClick({client: [e.pageX, e.pageY], normalized: [normalizedX, normalizedY] })
    }

    return (
        <div className="w-800 pt-12" onClick={handleClick}>
                <img src="image.jpeg" className="size-full" />
                {markers && markers.map((marker, index) => (
                    <Marker key={index} position={marker} isFound={true} />
                ))}
        </div>
    )
}

export default ImageContainer