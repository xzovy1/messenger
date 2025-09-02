import { useState } from "react"
import useFetch from "./useFetch";
import { useNavigate } from "react-router";
const Login = () => {
    const navigate = useNavigate();
    const [url, setUrl] = useState(null)
    const [formBody, setFormBody] = useState(null);
    const { fetchData, error, loading } = useFetch(url, "post", formBody);

    async function login(formData) {
        const username = formData.get("username");
        const password = formData.get("password");
        setFormBody({ username, password });
        setUrl('/log-in');
        // if (fetchData) {
        // navigate('/')
        // }
    }
    if (loading) {
        return (
            <>
                <div>Loading...</div>
            </>
        )
    }
    if (fetchData) {
        console.log(fetchData)
        return (
            <div>{fetchData}</div>
        )
    }

    return (
        <>
            {error ? <div className="error">An error occured</div> : null}
            <form action={login}>
                <label htmlFor="username">Username: </label>
                <input type="text" name="username" id="username" />
                <label htmlFor="password">Password: </label>
                <input type="password" name="password" id="password" />
                <button>Submit</button>
            </form>
            <a href="/sign-up">Create account</a>
        </>
    )
}

export default Login