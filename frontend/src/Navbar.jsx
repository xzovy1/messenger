import Logout from "./Logout";
const Navbar = ({user}) => {
return (
    <div className="header">
        <h2>Welcome, {user}</h2>
        <div></div>
        <Logout />
    </div>
)
}

export default Navbar;