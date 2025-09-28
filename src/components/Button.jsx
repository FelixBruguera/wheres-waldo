const Button = (props) => {
    return (
        <button className={`p-1 px-3 border-neutral-600 rounded-md hover:bg-accent hover:text-white hover:cursor-pointer transition-colors ${props.isActive && "bg-accent text-white"}`} onClick={props.onClick}>
            {props.children}
        </button>
    )
}

export default Button