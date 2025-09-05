import useFetch from "./useFetch"
const Component = ({ children, title, path, method, body }) => {
    return (
        <>
            <h2>{title}</h2>
            {children}
        </>
    )
}

export default Component