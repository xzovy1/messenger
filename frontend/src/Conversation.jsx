import { fetchDataGet, fetchDataPost } from "./helpers/fetchData";
import { useState, useEffect } from "react";

const Conversation = ({ conversation }) => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let url = `${import.meta.env.VITE_BACKEND}/api/chat/${conversation.id}`;
  console.log(conversation);
  useEffect(() => {
    // conversationId ? url = url + `${conversationId}` : url;
    const fetchConversation = async () => {
      try {
        console.log("fetched", url);
        const messagesData = await fetch(url, {
          mode: "cors",
          headers: {
            "content-type": "application/json", // ??????
            authorization: `bearer ${localStorage.jwt}`,
          },
        }).then((response) => response.json());
        console.log(messagesData);
        setData(messagesData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchConversation();
  }, [conversation]);

  async function sendMessage(formData) {
    console.log(conversation);
    formData.set("recipient", conversation.recipient);
    await fetch(url, {
      mode: "cors",
      headers: {
        authorization: `bearer ${localStorage.jwt}`,
      },
      method: "post",
      body: new URLSearchParams(formData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  if (error) {
    return <p className="error">an error occurred: {error} </p>;
  }
  if (loading) {
    return <p>Loading conversation...</p>;
  }
  return (
    <>
      <h2>Conversation</h2>
      <div>
        <ul>
          {data && data.length > 0 ? (
            data.map((message) => (
              <li key={message.id}>
                <div className="message">
                  <div>{message.body}</div>
                  <div>{message.sender.username}</div>
                </div>
              </li>
            ))
          ) : (
            <div>No messages yet. Start the conversation!</div>
          )}
        </ul>
        <form action={sendMessage}>
          <input type="text" name="message" id="message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
};

export default Conversation;
