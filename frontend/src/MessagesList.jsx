import { useState, useEffect } from "react";
import { fetchDataGet, fetchDataPost } from "./helpers/fetchData.js";

const MessagesList = ({ setConversation, setRight, messagesCount, setMessagesCount }) => {
  const [messageTrigger, setMessageTrigger] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = `${import.meta.env.VITE_BACKEND}/api/chat`;
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messages = await fetchDataGet(url)
        setData(messages)
        setMessagesCount(messages.length)
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [messageTrigger]);
  async function deleteMessage(id) {
    await fetchDataPost(url + `/${id}`, "delete", JSON.stringify({ id: id }))
    setMessageTrigger(Math.random());
  }
  if (error) {
    return <p className="error">an error occurred: {error} </p>;
  }
  if (loading) {
    return <p>Loading messages...</p>;
  }
  return (
    <>
      <h2>Messages</h2>
      <div className="scroll">
        {data && data.length > 0 ? (
          data.map((chat) => (
            <div key={chat.id} className="conversation">
              <div>{chat.users[0].username}</div>
              {chat.message[0] ? <div>{chat.message[0].body}</div> : null}
              <div>
                <button
                  onClick={() => {
                    setConversation({
                      id: chat.id,
                      recipient: chat.users[0],
                    });
                    setRight(true);
                  }}
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    deleteMessage(chat.id);
                    setMessagesCount(messagesCount--);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <>
            <div><b>No messages</b></div>
            <div>To start a conversation, go to contacts and click <i>message</i></div>
          </>
        )}
      </div>
    </>
  );
};

export default MessagesList;
