import { useState, useEffect } from "react";
import { fetchDataGet } from "./helpers/fetchData.js";
import styles from "./public/card.module.css"

const Profile = ({ setUser }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const url = `${import.meta.env.VITE_BACKEND}/api/user/profile`;
    const fetchData = async () => {
      try {
        const data = await fetchDataGet(url);
        setUser(data.username);
        setData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
        throw new Error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <p className="error">an error occurred: {error} </p>;
  }
  if (loading) {
    return <p>Loading Profile...</p>;
  }

  const { profile } = data;
  return (
    <>
      <h2>Profile</h2>
      <div>
        <div className={styles.input}>
          <p>Username: </p>
          <p> {data.username}</p>
        </div>
        <div className={styles.input}>
          <p>First Name: </p>
          <p> {profile.firstname}</p>
        </div>
        <div className={styles.input}>
          <p>Last Name: </p>
          <p> {profile.lastname}</p>
        </div>
        <div className={styles.input}>
          <p>Date of birth: </p>
          <p> {new Date(profile.dob).toDateString()}</p>
        </div>
        <div className={styles.input}>
          <p>About: </p>
          <p>{profile.bio}</p>
        </div>
      </div>
    </>
  );
};

export default Profile;
