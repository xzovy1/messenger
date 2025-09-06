import { useState } from "react"
import { useNavigate } from "react-router";
import { fetchDataPost } from "./helpers/fetchData";
const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)

    async function login(formData) {

        setLoading(true);
        const url = `${import.meta.env.VITE_BACKEND}/log-in`;
        await fetchDataPost(url, formData)
            .then(data => {
                localStorage.setItem("jwt", data.token);
                navigate('/')
            })
            .catch(error => {
                console.log(error);
                setError(error)
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
        )
    }

    return (
        <>
            {error ? <div className="error">An error occured {error.statusText}</div> : null}
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