import { useState } from "react";
import { useNavigate } from "react-router";
import { fetchDataPost } from "./helpers/fetchData";
import styles from './public/auth.module.css'

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function login(formData) {
    setLoading(true);
    JSON.stringify(Object.fromEntries(formData));
    const url = `${import.meta.env.VITE_BACKEND}/auth/log-in`;
    await fetchDataPost(
      url,
      "post",
      JSON.stringify(Object.fromEntries(formData)),
    )
      .then((data) => {
        localStorage.setItem("jwt", data);
        navigate("/home");
      })
      .catch((error) => {
        console.log('name: ', error.name, 'message:', error.message);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  if (loading) {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  }

  return (
    <>
      {error ? <ErrorMessage error={error} /> : null}
      <div className={styles.form}>
        <form action={login}>
          <div className={styles.info}>
            <h3>Welcome back!</h3>
            <div>We're glad you're here.</div>
          </div>
          <div className={styles.input}>
            <label htmlFor="username">Username: </label>
            <input type="text" name="username" id="username" autoComplete="current-username" required />
          </div>
          <div className={styles.input}>
            <label htmlFor="password">Password: </label>
            <input type="password" name="password" id="password" autoComplete="current-password" required />
          </div>
          <button>Log in</button>
        </form>
      </div>
      <div className={styles.footer}>Need an account? <a href="/auth/sign-up">Register</a></div>
    </>
  );
};

const ErrorMessage = ({ error }) => {
  console.log(error)
  if (error == "HTTP error: Status 403") {
    return <div className="error">Incorrect username or password</div>
  } else {
    return <div className="error">An error occurred {error}</div>
  }
}

export default Login;
