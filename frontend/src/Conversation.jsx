import { fetchDataGet, fetchDataPost } from "./helpers/fetchData";
import { useState, useEffect, useRef } from "react";

const Conversation = ({ conversation, user, messagesCount }) => {
  const [messageTrigger, setMessageTrigger] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let url = `${import.meta.env.VITE_BACKEND}/api/chat/${conversation.id}`;
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const conversationData = await fetchDataGet(url)
        setData(conversationData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
        // throw new Error(err)
      } finally {
        setLoading(false);
      }
    };
    if (conversation.id) {
      fetchConversation();
    }
  }, [conversation, messageTrigger]);

  async function sendMessage(formData) {
    formData.set("recipient", conversation.recipient.id);
    await fetchDataPost(url, 'post', JSON.stringify(Object.fromEntries(formData))) //new URLSearchParams(formData)
    setMessageTrigger(Math.random()); //used to trigger use effect

  }
  if (!conversation.id || messagesCount == 0) {
    return <p>No Conversation found</p>;
  }
  if (error) {
    return <p className="error">an error occurred: {error} </p>;
  }
  if (loading) {
    return <p>Loading conversation...</p>;
  }
  if (messagesCount > 0) {
    return (
      <>
        <h2>Conversation with {conversation.recipient.username}</h2>
        <div>
          <div className="scroll chatWindow">
            {data && data.length > 0 ? (
              data.map((message) => {
                if (user == message.sender.username) {
                  return (
                    <div key={message.id} className="sent">
                      {message.body}
                    </div>
                  );
                } else {
                  return (
                    <div key={message.id} className="received">
                      {message.body}
                    </div>
                  );
                }
              })
            ) : (
              <div>No messages yet. Start the conversation!</div>
            )}
          </div>
          <form action={sendMessage}>
            <input type="text" name="message" id="message" autoComplete="off" />
            <button type="submit">Send</button>
          </form>
        </div>
      </>
    );
  }
};

export default Conversation;
