const Component = ({ children, title }) => {
    return (
        <>
            <h2>{title}</h2>
            {children}
        </>
    )
}

export default Component