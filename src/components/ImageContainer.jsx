const ImageContainer = ({ onClick }) => {
    return (
        <div className="w-9/10 h-dvh mx-auto" onClick={(e) => {
            console.log(e)
            onClick(e)
        }}>
            <img src="image.jpeg" className="size-full " />
        </div>
    )
}

export default ImageContainer