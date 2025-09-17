import { useState } from "react";
import { useNavigate } from "react-router";
import { fetchDataPost } from "./helpers/fetchData";

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
        localStorage.setItem("jwt", data.token);
        if (!error) {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.log('name: ',error.name, 'message:', error.message);
        setError(error.message);
        // throw new Error(error);
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
      <form action={login}>
        <p></p>
        <div>
          <label htmlFor="username">Username: </label>
          <input type="text" name="username" id="username" autoComplete="current-username" required/>
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input type="password" name="password" id="password" autoComplete="current-password" required/>
        </div>
        <button>Log in</button>
      </form>
      <a href="/auth/sign-up">Create account</a>
    </>
  );
};

const ErrorMessage = ({error}) => {
  console.log(error)
  if(error == "HTTP error: Status 403"){
    return <div className="error">Incorrect username or password</div>
  }else{
    return <div className="error">An error occurred {error}</div> 
  }
}

export default Login;
