const DropdownMenu = ({ position, options, onClick }) => {
    return (
        <ul
            className="absolute bg-stone-700 text-white"
            style={{
                left: `${position[0]}px`,
                top: `${position[1]}px`
            }}
        >
            {options.map(option => <li key={option} className="px-2 py-1 border-1 border-stone-600 hover:bg-stone-900 hover:cursor-pointer transition-colors" onClick={onClick}>{option}</li>)}
        </ul>
    )
}

export default DropdownMenu