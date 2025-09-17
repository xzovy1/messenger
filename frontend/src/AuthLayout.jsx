import { Outlet } from "react-router";
import './public/auth.module.css'

const AuthLayout = () => {
  return (
    <div>
      <div className="header">
        <h2>Messenger App</h2>
      </div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
