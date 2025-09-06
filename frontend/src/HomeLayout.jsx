import { Outlet } from "react-router"
import { useEffect, useState } from "react"
import Component from "./Component"
import Conversation from "./Conversation"
import MessagesList from "./MessagesList"
import Logout from "./Logout"
const HomeLayout = () => {

    return (
        <>
            <Logout />
            <h1>Welcome</h1>
            <Component title="Messages">
                <MessagesList />

            </Component>
            <Component title="Current Conversation">
                <Conversation />
            </Component>
        </>
    )
}

export default HomeLayout