import { Outlet } from "react-router"
import Component from "./Component"
import Conversation from "./Conversation"
import MessagesList from "./MessagesList"
const HomeLayout = () => {
    return (
        <>
            <h1>Welcome</h1>
            <Component title="Messages" path="/api/chat/" method='get'>
                <MessagesList />
            </Component>
            <Component title="Conversation">
                <Conversation />
            </Component>
        </>
    )
}

export default HomeLayout