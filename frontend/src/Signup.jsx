import { useState } from "react";
import { useNavigate } from "react-router";
import { fetchDataPost } from "./helpers/fetchData";
import styles from "./public/auth.module.css"
const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  async function signup(formData) {
    const password = formData.get("password");
    const passwordConfirm = formData.get("password-confirm");
    if (password != passwordConfirm) {
      return setPasswordError(true);
    }
    const url = `${import.meta.env.VITE_BACKEND}/api/user`;

    await fetchDataPost(
      url,
      "post",
      JSON.stringify(Object.fromEntries(formData)),
    )
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        setError(error.message);
        throw new Error(error);
      })
      .finally(() => {
        setLoading(false);
        if (!error) {
          navigate("/auth/log-in");
        }
      });
  }
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      {passwordError ? (
        <div className="error">Passwords do not match</div>
      ) : null}
      {error ? <p className="error">an error occurred: {error} </p> : null}
      <div className={styles.form}>
        <form action={signup}>
          <h4>Create Account</h4>
          <div className={styles.input}>
            <label htmlFor="username">Username </label>
            <input type="text" name="username" id="username" required />
          </div>
          <div className={styles.input}>
            <label htmlFor="password">Password </label>
            <input type="password" name="password" id="password" required />
          </div>
          <div className={styles.input}>
            <label htmlFor="password-confirm">Confirm Password </label>
            <input type="password" name="password-confirm" id="password-confirm" required />
          </div>
          <div className={styles.input}>
            <label htmlFor="firstname">First Name </label>
            <input type="text" id="firstname" name="firstname" required />
          </div>
          <div className={styles.input}>
            <label htmlFor="lastname">Last Name </label>
            <input type="text" name="lastname" id="lastname" required />
          </div>
          <div className={styles.input}>
            <label htmlFor="dob">Birthday </label>
            <input type="date" name="dob" id="dob" required />
          </div>
          <div className={styles.input}>
            <label htmlFor="bio">About </label>
            <textarea name="bio" id="bio" maxLength="250"></textarea>
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
      <div className={styles.footer}> <a href="/auth/log-in">Return to login</a></div>
    </>
  );
};

export default Signup;
