import useFetch from "./useFetch"
import { useState } from "react"
import { useNavigate } from "react-router"

const Logout = () => {
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const [url, setUrl] = useState(null)
    const { fetchData } = useFetch(url, "get")
    const logout = () => {
        setUrl('/log-out');
        setData(fetchData);
        console.log(data);
        localStorage.clear();
        navigate('/log-in')
    }
    return <button onClick={logout}>Logout</button>
}

export default Logout