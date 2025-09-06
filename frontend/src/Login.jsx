import { useState } from "react"
import { useNavigate } from "react-router";
const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)
    async function login(formData) {
        const username = formData.get("username");
        const password = formData.get("password");
        const formBody = { username, password };
        console.log(formBody)
        let authenticated = false;
        setLoading(true);
        await fetch(`${import.meta.env.VITE_BACKEND}/log-in`, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            mode: "cors",
            body: new URLSearchParams(formData)
        })
            .then(response => {
                console.log(response)
                if (!response.ok) {
                    return setError(response.status)
                }
                authenticated = true;
                return response.json();

            })
            .then(data => {
                console.log(data)
                localStorage.setItem("jwt", data.token);
            })
            .catch(error => {
                console.log(error);
                setError(error)})
            .finally(() => {
                setLoading(false);
                if (authenticated) {
                    // navigate('/')
                }
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