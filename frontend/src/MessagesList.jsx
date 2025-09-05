import { Link } from "react-router"
import { useState, useEffect } from "react"
import useFetch from "./useFetch"
const MessagesList = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND}/api/chat`,
            {
                mode: "cors",
                headers: {
                    "authorization": `bearer ${localStorage.jwt}`
                }
            })
            .then(response => {
                if (response.status >= 400) {
                    console.log(response.statusText)
                    setError({ text: response.statusText, code: response.status })
                }
                response.json()
            })
            .then(data => setData(data))
            .catch(error => { setError(error); console.log(error.statusText) })
            .finally(setLoading(false))
    }, [])

    if (error) {
        return <p className="error">an error occurred: {error.code}</p>
    }
    if (loading) {
        return <p>Loading...</p>
    }
    return (
        <ul>
            {data ?
                data.map(chat => <li key={chat.id}>{chat.recipient}</li>)
                : <div>No messages</div>
            }
        </ul>
    )

}

export default MessagesList