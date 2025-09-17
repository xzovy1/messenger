import { useState } from "react";
import { useNavigate } from "react-router";
import { fetchDataPost } from "./helpers/fetchData";
import { Link } from "react-router";
const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function login(formData) {
    setLoading(true);
    JSON.stringify(Object.fromEntries(formData));
    const url = `${import.meta.env.VITE_BACKEND}/log-in`;
    await fetchDataPost(
      url,
      "post",
      JSON.stringify(Object.fromEntries(formData)),
    )
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        if (!error) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
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
      {error ? <div className="error">An error occured {error}</div> : null}
      <form action={login}>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" id="username" autoComplete="current-username"/>
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" id="password" autoComplete="current-password"/>
        <button>Log in</button>
      </form>
      <a href="/sign-up">Create account</a>
    </>
  );
};

export default Login;
