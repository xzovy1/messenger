import { useEffect, useState } from "react"
const useFetch = (path, method, body) => {
    const [fetchData, setfetchData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    console.log(path)
    useEffect(() => {
        if (path) {
            console.log(body)
            setLoading(true);

            const fetchData = async () => {
                setLoading(true)
                try {
                    const response = await fetch(`${import.meta.env.VITE_BACKEND}${path}`, {
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        mode: "cors",
                        method,
                        body: JSON.stringify(body)
                    })

                    const json = await response.json();
                    console.log(json)
                    setLoading(false);
                    setfetchData(json)
                } catch (error) {
                    setError(error)
                } finally {
                    setLoading(false)
                }
            }
            fetchData();
            // .catch(error => setError(error))
            // .finally(() => setLoading(false))
        }
    }, [path])

    return { fetchData, error, loading }
}

export default useFetch;