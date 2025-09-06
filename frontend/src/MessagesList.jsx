import { useState, useEffect } from "react"
import { fetchDataGet } from './helpers/fetchData.js'

const MessagesList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const url = `${import.meta.env.VITE_BACKEND}/api/chat`
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
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
        fetchMessages();
    }, [])

    if (error) {
        return <p className="error">an error occurred</p>
    }
    if (loading) {
        return <p>Loading messages...</p>
    }
    return (
        <>
            <h2>Messages</h2>
            <ul>
                {data && data.length > 0 ?
                    data.map(chat => <li key={chat.id}>{chat.recipient}</li>)
                    : <div>No messages</div>
                }
            </ul>
            <button>Start a Conversation</button>
        </>
    )

}

export default MessagesList