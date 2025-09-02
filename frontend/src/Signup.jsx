import { useState } from "react";
import useFetch from "./useFetch";
import { useNavigate } from "react-router";
const Signup = () => {
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState(false)
    const [url, setUrl] = useState(null)
    const [formBody, setFormBody] = useState(null);
    const { fetchData, error, loading } = useFetch(url, "post", formBody);

    async function signup(formData) {
        const username = formData.get("username");
        const password = formData.get("password");
        const passwordConfirm = formData.get("password-confirm")
        if (password != passwordConfirm) {
            return setPasswordError(true);
        }

        setFormBody({ username, password });
        setUrl('/sign-up');
        if (!error) {
            navigate('/')
        }
    }
    console.log(error)

    if (loading) {
        return <h1>Loading...</h1>
    }
    return (
        <>
            <h4>Create Account</h4>
            {passwordError ? <div className="error">Passwords do not match</div> : null}
            {error ? <div className="error">an error occured</div> : null}
            <form action={signup}>
                <label htmlFor="username">Username: </label>
                <input type="text" name="username" id="username" />
                <label htmlFor="password">Password: </label>
                <input type="password" name="password" id="password" />
                <label htmlFor="password-confirm">Confirm Password</label>
                <input type="password" name="password-confirm" id="password-confirm" />
                <button type="submit">Create</button>
            </form>
            <a href="/">Back to login</a>
        </>
    )
}

export default Signup