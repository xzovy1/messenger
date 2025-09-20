import styles from './public/app.module.css'
import "./App.css";
import messenger from './public/messenger.png'
import { useNavigate } from 'react-router';
const AuthHeader = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.header}>
            <h2>Odin Messenger</h2>
            <div onClick={() => { navigate('/') }}><img src={messenger} alt="" className="logo" /></div>
        </div>
    )
}

export default AuthHeader;