import { useState } from "react";
import Component from "./Component";
import Conversation from "./Conversation";
import MessagesList from "./MessagesList";
import Contacts from "./Contacts";
import Profile from "./Profile";
import Navbar from "./Navbar";
const HomeLayout = () => {
  const [toggleLeft, setLeft] = useState(true);
  const [toggleRight, setRight] = useState(false);

  const [user, setUser] = useState(null);
  const [conversation, setConversation] = useState({});
  const [messagesCount, setMessagesCount] = useState(0);

  return (
    <>
      <Navbar user={user} />
      <div id="body">
        <div id="leftTab">
          <Component>
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
          </Component>
        </div>
        <div id="rightTab">
          <Component>
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
                setConversation={setConversation}
                setRight={setRight}
                setMessagesCount={setMessagesCount}
                messagesCount={messagesCount}
              />
            )}
          </Component>
        </div>
      </div>
    </>
  );
};

export default HomeLayout;
