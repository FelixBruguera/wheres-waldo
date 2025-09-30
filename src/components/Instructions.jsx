import Button from "./Button"

const Instructions = ({ modal, found }) => {
    const characters = {"Waldo": "waldo.png", "Wenda": "wenda.png", "Wizard Whitebeard": "wizard-whitebeard.png", "Odlaw": "odlaw.png"}
    return (
        <div className="flex flex-col w-full items-center gap-6 p-2">
            <div className="grid grid-cols-3 grid-rows-1 w-full items-center justify-items-center">
                <h3 className="text-xl col-span-1 col-start-2 font-bold">Find these characters</h3>
                <Button className="ml-auto bg-accent text-white hover:bg-red-800" onClick={() => modal.current.close()}>Close</Button>
            </div>
            <ul className="w-9/10 flex flex-wrap lg:flex-nowrap items-center justify-evenly bg-white mx-auto">
                { Object.entries(characters).map(([key, value]) => {
                    const isFound = found.some(char => char.name === key)
                    return (
                    <li key={key} className="flex flex-col gap-1 lg:h-60">
                        <img src={`/${value}`} alt={key} className={`size-30 lg:size-35 ${isFound && "opacity-50"}`} />
                        <p className="text-center">{key}</p>
                        {isFound && <p className="text-center text-lg font-bold text-accent">Found</p>}
                    </li>)
                })}
            </ul>
        </div>
    )
}

export default Instructions