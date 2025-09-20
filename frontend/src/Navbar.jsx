import styles from './public/app.module.css'
import Logout from "./Logout";
const Navbar = ({ user }) => {
  return (
    <div className={styles.header}>
      <div>
        <h2>Welcome, {user}</h2>
      </div>
      <div>
        <Logout />
      </div>
    </div>
  );
};

export default Navbar;
