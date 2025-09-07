import { fetchDataGet, fetchDataPost } from "./helpers/fetchData";
import { useState, useEffect } from "react";

const Conversation = ({ chatIdRef }) => {
    const [data, setData] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let url = `${import.meta.env.VITE_BACKEND}/api/chat/${chatIdRef.current}`
        // conversationId ? url = url + `${conversationId}` : url;  
        const fetchConversation = async () => {
            try {
                console.log("fetched", url)
                const messagesData = await fetch(url, {
                    mode: "cors",
                    headers: {
                        'content-type': 'application/json', // ??????
                        'authorization': `bearer ${localStorage.jwt}`
                    }
                })
                console.log(messagesData)
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
    }, [chatIdRef.current])

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