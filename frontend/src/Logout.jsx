import { useState } from "react";
import { useNavigate } from "react-router";
import { fetchDataGet } from "./helpers/fetchData";
const Logout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nav = useNavigate();
  const logout = async () => {
    const url = `${import.meta.env.VITE_BACKEND}/auth/log-out`;
    try {
      await fetchDataGet(url);
      nav("/auth/log-in");
      setError(null);
      localStorage.clear();
    } catch (err) {
      setError(err.message);
      throw new Error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Logout;
