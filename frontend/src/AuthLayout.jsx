import { Outlet } from "react-router";
import styles from './public/auth.module.css'

const AuthLayout = () => {
  return (
    <div>
      <div className={styles.header}>
        <h2>Messenger App</h2>
      </div>
      <div className={styles.body}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
