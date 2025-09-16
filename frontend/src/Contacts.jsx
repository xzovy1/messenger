import { fetchDataGet, fetchDataPost } from "./helpers/fetchData";
import { useEffect, useState } from "react";

const Contacts = ({ setRight, setLeft, setConversation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const url = `${import.meta.env.VITE_BACKEND}/api/contacts`;
    const fetchContacts = async () => {
      try {
        const contacts = await fetchDataGet(url);
        setData(contacts);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
        console.log(err);
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  async function createChat(recipientId) {
    let url = `${import.meta.env.VITE_BACKEND}/api/chat/`;
    try {
      const response = await fetch(url, {
        method: "post",
        mode: "cors",
        headers: {
          authorization: `bearer ${localStorage.jwt}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ to: recipientId }),
      })
        .then((response) => response.json())
        .then((data) => { console.log(data); return data.conversation.id });
      setConversation({
        id: response,
        recipient: recipientId,
      });
      setRight(false); //display conversation tab
    } catch (error) {
      setError(error.message);
    }
  }

  if (loading) {
    return <p>Loading Contacts...</p>;
  }
  if (error) {
    return <p className="error">An Error has occured: {error}</p>;
  }
  return (
    <>
      <h3>Contacts</h3>
      <div>
        {data.map((contact) => {
          return (
            <div key={contact.id}>
              <img src={contact.profile.image} />
              <p>
                {contact.profile.firstname} {contact.profile.lastname}
              </p>
              <p>@{contact.username}</p>
              <button
                onClick={() => {
                  createChat(contact.id);
                  setRight(true);
                }}
              >
                Message
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Contacts;
