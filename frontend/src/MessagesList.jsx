import { useState, useEffect } from "react";
import { fetchDataGet } from "./helpers/fetchData.js";

const MessagesList = ({ setConversation, setRight }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = `${import.meta.env.VITE_BACKEND}/api/chat`;
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        await fetch(url, {
          mode: "cors",
          headers: {
            authorization: `bearer ${localStorage.jwt}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setData(data);
          });
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);
  async function deleteMessage(id) {
    console.log(id);
    await fetch(url + `/${id}`, {
      mode: "cors",
      method: "delete",
      headers: {
        authorization: `bearer ${localStorage.jwt}`,
        // "content-type": "application/json"
      },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
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
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <>
            <div>No messages</div>
            <button>Start a Conversation</button>
          </>
        )}
      </div>
    </>
  );
};

export default MessagesList;
