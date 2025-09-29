import Button from "./Button"

const Instructions = ({ modal, found }) => {
    const characters = {"Waldo": "waldo.png", "Wenda": "wenda.png", "Wizard Whitebeard": "wizard-whitebeard.png", "Odlaw": "odlaw.png"}
    return (
        <div className="flex flex-col w-full items-center gap-5">
            <div className="grid grid-cols-3 grid-rows-1 w-full items-center justify-items-center">
                <h3 className="text-lg col-span-1 col-start-2 font-bold text-accent">Find these characters</h3>
                <Button className="ml-auto" onClick={() => modal.current.close()}>Close</Button>
            </div>
            <ul className="w-8/10 flex items-center justify-evenly bg-white mx-auto">
                { Object.entries(characters).map(([key, value]) => {
                    const isFound = found.some(char => char.name === key)
                    return (
                    <li key={key} className="flex flex-col gap-1 h-70">
                        <p className="text-center">{key}</p>
                        <img src={`/${value}`} alt={key} className={`size-50 ${isFound && "opacity-50"}`} />
                        {isFound && <p className="text-center text-lg font-bold text-accent">Found</p>}
                    </li>)
                })}
            </ul>
        </div>
    )
}

export default Instructions