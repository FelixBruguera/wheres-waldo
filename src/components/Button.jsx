const Button = (props) => {
    return (
        <button className={`p-1 px-3 border-1 rounded-md hover:bg-blue-400 hover:cursor-pointer transition-colors ${props.isActive && "bg-blue-500"}`} {...props}>
            {props.children}
        </button>
    )
}

export default Button