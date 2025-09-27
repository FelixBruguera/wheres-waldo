const ImageContainer = ({ onClick, zoomLevel }) => {
    console.log(zoomLevel)
    const zoomClass = zoomLevel === 1 ? "size-full" : zoomLevel == 2 ? "w-500" : "w-600"
    return (
        <div className={`${zoomClass}`} onClick={(e) => {
            console.log(e)
            onClick(e)
        }}>
            <img src="image.jpeg" className="size-full" />
        </div>
    )
}

export default ImageContainer