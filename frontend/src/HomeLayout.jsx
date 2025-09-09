import { Outlet } from "react-router";
import { useEffect, useState, useRef } from "react";
import Component from "./Component";
import Conversation from "./Conversation";
import MessagesList from "./MessagesList";
import Contacts from "./Contacts";
import Logout from "./Logout";
import Profile from "./Profile";
const HomeLayout = () => {
  const [toggleLeft, setLeft] = useState(true);
  const [toggleRight, setRight] = useState(false);
  const [user, setUser] = useState("");
  // const chatIdRef = useRef("")
  const [conversation, setConversation] = useState({});
  return (
    <>
      <Logout />
      <h1>Welcome</h1>
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
              <Profile setUser={setUser}/>
            ) : (
              <Contacts
                setRight={setRight}
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
              <Conversation conversation={conversation} user={user}/>
            ) : (
              <MessagesList setConversation={setConversation} setRight={setRight}/>
            )}
          </Component>
        </div>
      </div>
    </>
  );
};

export default HomeLayout;
