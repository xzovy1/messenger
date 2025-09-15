import { useState } from "react";
import { useNavigate } from "react-router";
import { fetchDataPost } from "./helpers/fetchData";
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

    // setLoading(true);
    await fetchDataPost(url, "post", JSON.stringify(Object.fromEntries(formData)))
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        setError(error.message);
        // throw new Error(error);
      })
      .finally(() => {
        setLoading(false);
        if (!error) {
          // navigate("/log-in");
        }
      });
  }
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <h4>Create Account</h4>
      {passwordError ? (
        <div className="error">Passwords do not match</div>
      ) : null}
      {error ? <p className="error">an error occurred: {error} </p> : null}
      <form action={signup}>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" id="username" />

        <label htmlFor="password">Password: </label>
        <input type="password" name="password" id="password" />

        <label htmlFor="password-confirm">Confirm Password</label>
        <input type="password" name="password-confirm" id="password-confirm" />

        <label htmlFor="firstname">First Name</label>
        <input type="text" id="firstname" name="firstname" />

        <label htmlFor="lastname">Last Name</label>
        <input type="text" name="lastname" id="lastname" />

        <label htmlFor="dob">Date of birth</label>
        <input type="date" name="dob" id="dob" />

        <label htmlFor="bio">Bio</label>
        <textarea name="bio" id="bio"></textarea>

        <button type="submit">Create</button>
      </form>
      <a href="/">Back to login</a>
    </>
  );
};

export default Signup;
