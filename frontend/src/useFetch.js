import { useEffect, useState } from "react"
const useFetch = (path, method, body) => {
    const [fetchData, setfetchData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (body) {
            console.log(body)
            setLoading(true);
            fetch(`${import.meta.env.VITE_BACKEND}${path}`, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                mode: "cors",
                method,
                body: JSON.stringify(body)
            })
                .then(response => {
                    if (response.status >= 400) {
                        return setError(error)
                    }
                    return response.json()
                })
                .then(data => {
                    console.log(data)
                    setfetchData(data)

                })
                .catch(error => setError(error))
                .finally(() => setLoading(false))
        }
    }, [path])

    return { fetchData, error, loading }
}

export default useFetch;