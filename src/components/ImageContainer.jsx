const ImageContainer = ({ onClick, zoomLevel }) => {
    console.log(zoomLevel)
    const zoomClass = zoomLevel === 1 ? "size-full" : zoomLevel == 2 ? "w-500" : "w-600"
    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const normalizedX = x / rect.width
        const normalizedY = y / rect.height
        onClick({client: [e.pageX, e.pageY], normalized: [normalizedX, normalizedY] })
    }

    return (
        <div className={`${zoomClass}`} onClick={(e) => handleClick(e)}>
            <img src="image.jpeg" className="size-full" />
        </div>
    )
}

export default ImageContainer