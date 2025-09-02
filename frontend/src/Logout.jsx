import useFetch from "./useFetch"
import { useState } from "react"
const Logout = () => {
    const [url, setUrl] = useState(null)
    const { fetchData } = useFetch(url, "get")
    const logout = () => {
        setUrl('/log-out')
    }
    return <button onClick={logout}>Logout</button>
}

export default Logout