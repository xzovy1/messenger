import { Link } from "react-router";

const ErrorPage = () => {
  return (
    <div>
      <h1>Oh no, this route doesn't exist or an error occurred!</h1>
      <Link to="/">You can go back to the home by clicking here, though!</Link>
      <div>or</div>
      <Link to="/log-in"> Log in</Link>
    </div>
  );
};

export default ErrorPage;
