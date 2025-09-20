import { useState, useEffect } from "react";
import { fetchDataGet, fetchDataPost } from "./helpers/fetchData.js";
import styles from './public/card.module.css'

const MessagesList = ({
  setConversation,
  setRight,
  messagesCount,
  setMessagesCount,
}) => {
  const [messageTrigger, setMessageTrigger] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = `${import.meta.env.VITE_BACKEND}/api/chat`;
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messages = await fetchDataGet(url);
        setData(messages);
        console.log(messages);
        setMessagesCount(messages.length);
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
    await fetchDataPost(url + `/${id}`, "delete", JSON.stringify({ id: id }));
    setMessageTrigger(Math.random());
  }
  function openMessage(id, recipient) {
    setConversation({
      id,
      recipient,
    });
    setRight(true);
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
      <div className={styles.scroll}>
        {data && data.length > 0 ? (
          data.map((chat) => {
            return (
              <div key={chat.id} className={`${styles.conversation}`}>
                <div>{chat.users[0].username} </div>
                <MessagePreview
                  message={chat.message[0]}
                  recipient={chat.users[0].id}
                />

                <div>
                  <button
                    onClick={() => {
                      openMessage(chat.id, chat.users[0]);
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
            );
          })
        ) : (
          <>
            <div>
              <b>No messages</b>
            </div>
            <div>
              To start a conversation, go to contacts and click <i>message</i>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const MessagePreview = ({ message, recipient }) => {
  if (message) {
    if (!message.read && recipient != message.recipient_id) {
      return (
        <div className={styles.messagePreview}>
          <i>{message.body}</i>
        </div>
      );
    } else {
      return <div className={styles.messagePreview}>{message.body}</div>;
    }
  } else {
    return (
      <div>
        <i>No message</i>
      </div>
    );
  }
};

export default MessagesList;
