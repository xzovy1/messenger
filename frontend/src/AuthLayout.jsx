import { Outlet } from "react-router"
import Logout from "./Logout"

const AuthLayout = () => {
    return (
        <>
            <h1>Messenger</h1>
            <Outlet />
            <Logout />
        </>
    )
}

export default AuthLayout