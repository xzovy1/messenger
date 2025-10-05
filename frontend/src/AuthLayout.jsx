import { Outlet } from "react-router";
import AuthHeader from "./AuthHeader";
import styles from './public/auth.module.css'

const AuthLayout = () => {
  return (
    <>
      <AuthHeader />
      <div>
        <div className={styles.body}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
