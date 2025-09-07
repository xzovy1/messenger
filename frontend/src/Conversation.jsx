import { fetchDataGet } from "./helpers/fetchData";
import { useState, useEffect } from "react";
const Conversation = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = `${import.meta.env.VITE_BACKEND}/api/chat`
    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const messagesData = await fetchDataGet(url);
                setData(messagesData);
                setError(null);
            } catch (err) {
                setError(err.message);
                setData(null)
            } finally {
                setLoading(false);
            }
        }
        fetchConversation();
    }, [])

    if (error) {
        return <p className="error">an error occurred: {error} </p>
    }
    if (loading) {
        return <p>Loading conversation...</p>
    }
    return (
        <>
            <h2>Conversation</h2>
            <ul>
                {data && data.length > 0 ?
                    data.map(chat => <li key={chat.id}>{chat.recipient}</li>)
                    : <div>Nothing found</div>
                }
            </ul>
        </>
    )

}

export default Conversation