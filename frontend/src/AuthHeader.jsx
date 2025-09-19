import styles from './public/app.module.css'
import "./App.css";
import messenger from './public/messenger.png'
const AuthHeader = () => {
    return (
            <div className={styles.header}>
                <h2>Odin Messenger</h2>
                <div><img src={messenger} alt="" className="logo"/></div>
            </div>
    )
}

export default AuthHeader;