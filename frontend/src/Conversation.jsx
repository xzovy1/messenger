import { fetchDataGet, fetchDataPost } from "./helpers/fetchData";
import { useState, useEffect, useRef } from "react";

const Conversation = ({ conversation, user }) => {
  const [messageTrigger, setMessageTrigger] = useState(0);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let url = `${import.meta.env.VITE_BACKEND}/api/chat/${conversation.id}`;
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const messagesData = await fetch(url, {
          mode: "cors",
          headers: {
            "content-type": "application/json",
            authorization: `bearer ${localStorage.jwt}`,
          },
        }).then((response) => response.json());
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
  }, [conversation, messageTrigger]);

  async function sendMessage(formData) {
    formData.set("recipient", conversation.recipient.id);
    await fetch(url, {
      mode: "cors",
      headers: {
        authorization: `bearer ${localStorage.jwt}`,
      },
      method: "post",
      body: new URLSearchParams(formData),
    })
      .then((response) => {
        setMessageTrigger(Math.random()) //used to trigger use effect
        return response.json()
      })
  }

  if (error) {
    return <p className="error">an error occurred: {error} </p>;
  }
  if (loading) {
    return <p>Loading conversation...</p>;
  }
  return (
    <>
      <h2>Conversation with {conversation.recipient.username}</h2>
      <div>
        <div className="scroll chatWindow">
          {data && data.length > 0 ? (
            data.map((message) => {
              if(user == message.sender.username){
                return (<div key={message.id} className="sent">{message.body}</div>)
              }else{
                return (<div key={message.id} className="received">{message.body}</div>)
              }
              })
          ) : (
            <div>No messages yet. Start the conversation!</div>
          )}
        </div>
        <form action={sendMessage}>
          <input type="text" name="message" id="message" autoComplete="off"/>
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
};

export default Conversation;
