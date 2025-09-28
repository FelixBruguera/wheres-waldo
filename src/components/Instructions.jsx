const Instructions = () => {
    const characters = {"Waldo": "waldo.png", "Wenda": "wenda.png", "Wizard Whitebeard": "wizard-whitebeard.png", "Odlaw": "odlaw.png"}
    return (
        <div className="flex flex-col w-5/10 items-center gap-5 mx-auto">
            <h1 className="text-2xl font-bold text-accent">Welcome to Where's Waldo?</h1>
            <h3 className="text-lg">Find these characters</h3>
            <ul className="flex items-center justify-evenly bg-white">
                { Object.entries(characters).map(([key, value]) => {
                    return (
                    <li key={key}>
                        <img src={`/${value}`} alt={key} className="size-50" />
                        <p className="font-bold text-center">{key}</p>
                    </li>)
                })}
            </ul>
        </div>
    )
}

export default Instructions