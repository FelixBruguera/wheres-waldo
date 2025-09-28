const DropdownMenu = ({ position, characters, onClick }) => {
    return (
        <dialog open={position}>
            <ul
                className="absolute bg-stone-700 text-white opacity-100"
                style={{
                    left: `${position[0]}px`,
                    top: `${position[1]}px`
                }}
            >
                {characters.map(character => <li key={character.id} className="px-2 py-1 border-1 border-stone-600 hover:bg-stone-900 hover:cursor-pointer transition-colors" onClick={() => onClick(character)}>{character.name}</li>)}
            </ul>
        </dialog>
    )
}

export default DropdownMenu