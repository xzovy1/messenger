import { Outlet } from "react-router"
import { useEffect, useState, useRef } from "react"
import Component from "./Component"
import Conversation from "./Conversation"
import MessagesList from "./MessagesList"
import Contacts from "./Contacts"
import Logout from "./Logout"
import Profile from "./Profile"
const HomeLayout = () => {
    const [toggleLeft, setLeft] = useState(false)
    const [toggleRight, setRight] = useState(false);
    const chatIdRef = useRef("")
    return (
        <>
            <Logout />
            <h1>Welcome</h1>
            <div id="body">
                <div id="leftTab">
                    <Component >
                        <button onClick={() => { setLeft(!toggleLeft) }}>{toggleLeft ? "View Contacts" : "View Profile"}</button>
                        {toggleLeft ? <Profile /> : <Contacts setRight={setRight} chatIdRef={chatIdRef} />}
                    </Component>
                </div>
                <div id="rightTab">
                    <Component >
                        <button onClick={() => { setRight(!toggleRight) }}>{toggleRight ? "View Conversation" : "View Messages"}</button>
                        {toggleRight ? <MessagesList /> : <Conversation chatIdRef={chatIdRef} />}
                    </Component>
                </div>
            </div>
        </>
    )
}

export default HomeLayout