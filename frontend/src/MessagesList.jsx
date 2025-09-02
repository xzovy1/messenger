import { Link } from "react-router"
import useFetch from "./useFetch"
const MessagesList = () => {
    const { fetchData, loading, error } = useFetch("/api/chat", "get")



    return (
        <ul>
            {fetchData ?
                fetchData.map(chat => <li key={chat.id}>{chat.recipient}</li>)
                : <div>No messages</div>
            }
        </ul>
    )

}

export default MessagesList