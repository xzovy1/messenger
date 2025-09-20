import { useState } from "react";
import Conversation from "./Conversation";
import MessagesList from "./MessagesList";
import Contacts from "./Contacts";
import Profile from "./Profile";
import Navbar from "./Navbar";
import styles from "./public/card.module.css"

const HomeLayout = () => {
  const [toggleLeft, setLeft] = useState(true);
  const [toggleRight, setRight] = useState(false);

  const [user, setUser] = useState(null);
  const [conversation, setConversation] = useState({});
  const [messagesCount, setMessagesCount] = useState(0);
  const [error, setError] = useState(null);
  if (!localStorage.jwt) {
    return (
      <>
        <h3>An error occurred</h3>
        <a href="/auth/log-in">Log in</a>
      </>
    )
  }

  return (
    <>
      <Navbar user={user} />
      <div className={styles.body}>
        <div id="leftTab" className={styles.card}>
          <button
            onClick={() => {
              setLeft(!toggleLeft);
            }}
          >
            {toggleLeft ? "View Contacts" : "View Profile"}
          </button>
          {toggleLeft ? (
            <Profile setUser={setUser} />
          ) : (
            <Contacts
              setRight={setRight}
              setLeft={setLeft}
              conversation={conversation}
              setConversation={setConversation}

            />
          )}
        </div>
        <div id="rightTab" className={styles.card}>
          <button
            onClick={() => {
              setRight(!toggleRight);
            }}
          >
            View{toggleRight ? " Messages" : " Conversation"}
          </button>
          {toggleRight ? (
            <Conversation
              conversation={conversation}
              user={user}
              messagesCount={messagesCount}
            />
          ) : (
            <MessagesList
              setRight={setRight}
              setMessagesCount={setMessagesCount}
              messagesCount={messagesCount}
              setConversation={setConversation}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default HomeLayout;
