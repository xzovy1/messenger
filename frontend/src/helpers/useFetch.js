import { useState, useEffect } from "react";
import { fetchDataGet } from "./fetchData";

const useFetch = (cb, url, id = null) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const controller = new AbortController;

    useEffect(() => {
        console.log('test')

        const getData = async () => {
            try {
                const data = await cb(url, controller.signal);

                console.log(data)
                setData(data);
                setError(null);
            } catch (err) {
                console.log(err)
                setError(err.message);
                setData([]);
                throw new Error(error);
            } finally {
                () => {
                    setLoading(false);
                }
            }
        }
        getData();

        // return () => controller.abort();
    }, [])
    return { data, loading, error }
}

export default useFetch;