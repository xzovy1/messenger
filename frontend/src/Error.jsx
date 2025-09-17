import { Link } from "react-router";

const ErrorPage = () => {
  return (
    <div>
      <h1>Oh no!</h1>
      <h3>This route doesn't exist or an error occurred!</h3>
      <Link to="/home">You can go back to the home by clicking here, though!</Link>
      <div>or</div>
      <Link to="/auth/log-in"> Log in</Link>
    </div>
  );
};

export default ErrorPage;
