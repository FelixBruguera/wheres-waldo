const DropdownMenu = ({ position, characters, onClick }) => {
    return (
        <dialog open={position}>
            <ul
                className="absolute bg-background opacity-100"
                style={{
                    left: `${position[0]}px`,
                    top: `${position[1]}px`
                }}
            >
                {characters.map(character => <li key={character.id} className="px-2 py-1 border-1 text-black border-stone-300 hover:bg-accent hover:text-white hover:cursor-pointer transition-colors" onClick={() => onClick(character)}>{character.name}</li>)}
            </ul>
        </dialog>
    )
}

export default DropdownMenu