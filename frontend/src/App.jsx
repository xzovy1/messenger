import { useEffect, useState, useRef } from "react";
import "./App.css";
import { Outlet, useNavigate } from "react-router";
import styles from './public/app.module.css'
import AuthHeader from "./AuthHeader";
function App() {
  const [exampleText, setExampleText] = useState("")
  const [trigger, setTrigger] = useState(0);
  const navigate = useNavigate();


  function dummySend(e) {
    e.target.blur();
    // setExampleText(''); 
    // setTrigger(Math.random()* 10)
  }

  useEffect(() => {
    const examples = [
      "Hey! how are you?",
      "Any update on the work order?",
      "Got any plans this Friday?"
    ]
    let text = examples[0]
    let i = 0;
    let initial = ""
    const message = setInterval(() => {

      if (i <= text.length - 1) {
        let value = initial += text[i]
        setExampleText(value);
        i++;
      } else if (i == text.length + 8) {
        i = 0;
        setExampleText('');
        initial = ""
        // text = examples[Math.floor(Math.random() * 3)]
      } else {
        i++;
      }

      return () => {
        console.log("cleared")
        clearInterval(message)
      }
    }, 200)
  }, [trigger])

  return (
    <>
      <AuthHeader />

      <div className={styles.body}>
        <div id="info" className={`${styles.chatbox} ${styles.sent}`}>
          <strong>The 'all-you-need' messaging app</strong>
          <div className={styles.tailLeft}></div>
        </div>
        <div className={`${styles.chatbox} ${styles.received}`}>
          <div><strong>Safe. Friendly. Accessible.</strong></div>
          <div className={styles.tailRight}></div>
        </div>
        <div className={styles.input}>
          <div className={styles.userInput}>
            <div className={styles.text}>{exampleText}</div>
            <div className={styles.cursor}></div>
          </div>
          <div className={styles.chatboxButton}><button onClick={dummySend}>Send</button></div>
        </div>
        <div className={styles.buttons}>
          <button onClick={() => navigate('/auth/log-in')}>Log in</button>
          <button onClick={() => navigate('/auth/sign-up')}>Sign up</button>
        </div>
      </div>
      {/* <Outlet /> */}
      <div className={styles.footer}><a href="https://www.flaticon.com/free-icons/message" title="message icons">Message icons created by Freepik - Flaticon</a></div>
    </>
  );
}

export default App;
