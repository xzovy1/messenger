import { Outlet } from "react-router"

const AuthLayout = () => {
    return (
        <>
            <h1>Messenger App</h1>
            <Outlet />
        </>
    )
}

export default AuthLayout