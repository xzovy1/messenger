import { Outlet } from "react-router"
import { useEffect, useState } from "react"
import Component from "./Component"
import Conversation from "./Conversation"
import MessagesList from "./MessagesList"
import Contacts from "./Contacts"
import Logout from "./Logout"
import Profile from "./Profile"
const HomeLayout = () => {
    const [toggleMessages, setMessages] = useState(true)
    const [toggleConversation, setConversation] = useState(false)

    return (
        <>
            <Logout />
            <h1>Welcome</h1>
            <Component>
                {toggleMessages ? <MessagesList /> : <Profile />}
            </Component>
            <Component>
                {toggleConversation ? <Conversation /> : <Contacts />}
            </Component>
        </>
    )
}

export default HomeLayout