import { useState, useEffect, use } from "react";
import { fetchDataGet, fetchDataPost } from "./helpers/fetchData.js";
import styles from "./public/profile.module.css"

const Profile = ({ setUser }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

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
    return <p className="error">An error occurred: {error} </p>;
  }
  if (loading) {
    return <p>Loading Profile...</p>;
  }

  const updateProfile = () => {
    setUpdating(true);
  }

  return (
    <>
      <h2>Profile</h2>
      <img srcSet={data.profile.image} alt="profile pic" className={styles.avatar} />
      {updating ? <UpdateProfileForm userInfo={data} setUpdating={setUpdating} /> : <ProfileInfo data={data} updateProfile={updateProfile} />}
    </>
  )
};

const ProfileInfo = ({ data, updateProfile }) => {
  const { profile } = data;
  return (
    <div className={styles.body}>
      <div className={` ${styles.info}`}>
        <p><strong>Username:</strong> </p>
        <p> {data.username}</p>
      </div>
      <div className={` ${styles.info}`}>
        <p><strong>First Name: </strong></p>
        <p> {profile.firstname}</p>
      </div>
      <div className={` ${styles.info}`}>
        <p><strong>Last Name: </strong></p>
        <p> {profile.lastname}</p>
      </div>
      <div className={` ${styles.info}`}>
        <p><strong>Date of birth: </strong></p>
        <p> {new Date(profile.dob).toDateString()}</p>
      </div>
      <div className={` ${styles.info}`}>
        <p><strong>About: </strong></p>
        <p>{profile.bio}</p>
      </div>
      <button onClick={updateProfile}>Update</button>
    </div>
  );
}


const UpdateProfileForm = ({ userInfo, setUpdating }) => {
  const [updateLoginInfo, setUpdateLoginInfo] = useState(false);
  const url = `${import.meta.env.VITE_BACKEND}/api/user/${userInfo.id}`;

  const uploadImage = async (img) => {
    const response = await fetch(url + `/image`, {
      headers: {
        authorization: `bearer ${localStorage.jwt}`,
      },
      body: img,
      mode: "cors",
      method: "post",

    }).then(response => response.json())
    console.log(img)
    console.log(response)
    return response

  }

  const updateProfile = async (formData) => {
    const image = formData.get("image")
    console.log("image", image)
    const data = JSON.stringify(Object.fromEntries(formData))
    const response = await fetchDataPost(url + `/profile`, 'put', data);
    console.log(response)
    setUpdating(false);
  }

  const cancelUpdate = () => {
    setUpdating(false)
  }
  if (!updateLoginInfo) {
    return (
      <div className={styles.body}>
        <form action={updateProfile}>
          <div className={` ${styles.info}`}>
            <label htmlFor="firstname"><strong>First Name: </strong></label >
            <input type="text" name="firstname" id="firstname" defaultValue={userInfo.profile.firstname} />
          </div>
          <div className={` ${styles.info}`}>
            <label htmlFor="lastname"><strong>Last Name: </strong></label >
            <input type="text" name="lastname" id="lastname" defaultValue={userInfo.profile.lastname} />
          </div>
          <div className={` ${styles.info}`}>
            <label htmlFor="dob"><strong>Date of birth: </strong></label >
            <input type="date" name="dob" id="dob" defaultValue={userInfo.profile.dob.split('T')[0]} />
          </div>
          <div className={` ${styles.info}`}>
            <label htmlFor="bio"><strong>About: </strong></label >
            <textarea name="bio" id="bio" maxLength="250" defaultValue={userInfo.profile.bio}></textarea>
          </div>
          <button>Submit</button>
          <button onClick={cancelUpdate}>Cancel</button>
        </form>
        <div className={styles.imageUpload}>
          <form action={uploadImage}>
            <label htmlFor="image"><strong>Profile Picture: </strong></label >
            <input type="file" name="image" id="image" />
            <button>Update Image</button>
          </form>
        </div>
        <button onClick={() => { setUpdateLoginInfo(true) }}>Update Login Info</button>
      </div>
    )
  }
  else {
    return (
      <UpdateLoginForm setUpdateLoginInfo={setUpdateLoginInfo} userInfo={userInfo} />
    )
  }
}

const UpdateLoginForm = ({ setUpdateLoginInfo, userInfo }) => {

  const [passwordError, setPasswordError] = useState(null);

  const updateUser = async (formData) => {
    const url = `${import.meta.env.VITE_BACKEND}/api/user/${userInfo.id}`;
    const password = formData.get("password");
    const passwordConfirm = formData.get("password-confirm");
    if (password != passwordConfirm) {
      return setPasswordError(true);
    }
    const data = JSON.stringify(Object.fromEntries(formData))
    const response = await fetchDataPost(url, 'put', data);
    console.log(response)
    setUpdateLoginInfo(false);
  }
  return (
    <div className={styles.body}>
      {passwordError ? (
        <div className="error">Passwords do not match</div>
      ) : null}
      <form action={updateUser}>
        <div className={` ${styles.info}`}>
          <label htmlFor="username"><strong>Username:</strong> </label>
          <input type="text" name="username" defaultValue={userInfo.username} />
        </div>
        <div className={` ${styles.info}`}>
          <label htmlFor="password"><strong>Password: </strong></label >
          <input type="text" name="password" id="password" />
        </div>
        <div className={` ${styles.info}`}>
          <label htmlFor="password-confirm"><strong>Confirm Password: </strong></label >
          <input type="text" name="password-confirm" id="password-confirm" />
        </div>
        <button>Submit</button>
        <button onClick={() => setUpdateLoginInfo(false)}>Cancel</button>
      </form>
    </div>
  )

}

export default Profile;
