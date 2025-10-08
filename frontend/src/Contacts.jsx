import { fetchDataGet, fetchDataPost } from "./helpers/fetchData";
import { useEffect, useState } from "react";
import styles from './public/card.module.css'

const Contacts = ({ setRight, setConversation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const url = `${import.meta.env.VITE_BACKEND}/api/contacts`;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contacts = await fetchDataGet(url);
        setData(contacts);
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  async function createChat(recipientId) {
    setRight(true)
    let url = `${import.meta.env.VITE_BACKEND}/api/chat/`;
    try {
      const response = await fetch(url, {
        method: "post",
        mode: "cors",
        headers: {
          authorization: `bearer ${localStorage.jwt}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ recipientId }),
      })
        .then((response) => response.json())
        .then((data) => {
          return data.conversation.id;
        });
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
    return <p className="error">An error occurred: {error.message}</p>;
  }
  return (
    <div>
      <h2>Contacts</h2>
      <ContactsList contacts={data} createChat={createChat}/>
    </div>
  );
};

const ContactsList = ({contacts, createChat}) => {
  if(contacts.length == 0 || !contacts){
    return (
      <div>No Contacts Found</div>
    )
  }
  return (
      <div className={styles.scroll}>
        {contacts.map((contact) => {
          return (
            <div key={contact.id} className={styles.contact}>
              <img src={contact.profile.image} alt="profile image" />
              <div>

                <p>
                  {contact.profile.firstname} {contact.profile.lastname}
                </p>
                <p>@{contact.username}</p>
              </div>
              <button
                onClick={() => {
                  createChat(contact.id);
                }}
              >
                Message
              </button>
            </div>
          );
        })}
      </div>
  )
}

export default Contacts;
