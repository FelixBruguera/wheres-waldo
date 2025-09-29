const Button = (props) => {
    const { isActive, onClick, children, className} = props
    return (
        <button className={`p-1 px-3 border-neutral-600 rounded-md hover:bg-accent hover:text-white hover:cursor-pointer transition-colors ${isActive && "bg-accent text-white"} ${className}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default Button