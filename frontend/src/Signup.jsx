import { useState } from "react";
import { useNavigate } from "react-router";
import { fetchDataPost } from "./helpers/fetchData";
import styles from "./public/auth.module.css"
const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateDOB = (dob) => {
    let birthdate = new Date(dob)
    let currentDate = new Date()
    let age = currentDate.getFullYear() - birthdate.getFullYear()
    if (birthdate.getMonth() >= currentDate.getMonth()) {
      if (birthdate.getDate() >= currentDate.getDate()) {
        age--;
      }
    }
    
    if (age > 110 || age < 12) {
      return false
    }else {return true}
  }

  const validateUsername = (username) => {

    //username has no special characters
    console.log(username)
    return !/[^a-zA-Z0-9]/.test(username) && /^\w{4,20}/.test(username)

  }

  const validateName = (name) => {
    return !/[^A-Za-z]/.test(name) && /^\w{3,20}/.test(name)
  }

  async function signup(formData) {
    const password = formData.get("password");
    const passwordConfirm = formData.get("password-confirm");

    if (!validateName(formData.get("firstname"))) {
      return setError("Firstname must only contain letters, being between 3 and 20 characters")
    }
    if (!validateName(formData.get("lastname"))) {
      return setError("Last must only contain letters, being between 3 and 20 characters")
    }
    if (!validateUsername(formData.get("username"))) {
      return setError("Username must only contain letters, numbers and be between 4 and 20 characters")
    }
    if(!validateDOB(formData.get("dob"))){
      setError("Invalid date range")
    }
    if (password != passwordConfirm) {
      return setError("Passwords do not match");
    }
    const url = `${import.meta.env.VITE_BACKEND}/api/user`;

    await fetchDataPost(
      url,
      "post",
      JSON.stringify(Object.fromEntries(formData)),
    )
      .then((data) => {
        // console.log(data);
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
      {error ? (
        <div className="error">{error}</div>
      ) : null}
      <div className={styles.form}>
        <form onSubmit={e => {
          e.preventDefault();
          signup(new FormData(e.target))
        }} name="signup-form">
          <h4>Create Account</h4>
          <div className={styles.input}>
            <label htmlFor="username">Username </label>
            <input type="text" name="username" id="username" required minLength={4} maxLength={20}/>
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
            <input type="text" id="firstname" name="firstname" required  minLength={3} maxLength={20}/>
          </div>
          <div className={styles.input}>
            <label htmlFor="lastname">Last Name </label>
            <input type="text" name="lastname" id="lastname" required minLength={2} maxLength={20}/>
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
