import Instructions from "./Instructions"
import Button from "./Button"

const Start = () => {
    return (
        <div className="absolute flex flex-col gap-3 items-center justify-center w-dvw h-dvh bg-gray-200">
            <Instructions />
            <Button>Start game</Button>
        </div>
    )
}

export default Start