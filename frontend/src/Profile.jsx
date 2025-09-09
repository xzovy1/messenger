import { useState, useEffect } from "react";
import { fetchDataGet } from "./helpers/fetchData.js";

const Profile = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = `${import.meta.env.VITE_BACKEND}/api/user/profile`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDataGet(url);
        setData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
        setError(null);
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
        <p>Username: </p>
        <p> {data.username}</p>
        <p>First Name: </p>
        <p> {profile.firstname}</p>
        <p>Last Name: </p>
        <p> {profile.lastname}</p>
        <p>Date of birth: </p>
        <p> {new Date(profile.dob).toDateString()}</p>
        <p>About: </p>
        <p>{profile.bio}</p>
      </div>
    </>
  );
};

export default Profile;
