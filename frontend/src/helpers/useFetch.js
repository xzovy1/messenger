import { useEffect, useState, useRef } from "react";
import { fetchDataGet } from "./fetchData";
export const useFetch = (cb, url) => {
  const callbackRef = useRef(cb);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(url);
  useEffect(() => {
    if (url) {
      const fetchData = async () => {
        try {
          const response = await callbackRef.current(url);

          const json = await response.json();
          setLoading(false);
          setData(json);
        } catch (error) {
          console.log(error);
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      // .catch(error => setError(error))
      // .finally(() => setLoading(false))
    }
  }, [url]);

  return { data, error, loading };
};
