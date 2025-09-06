import { fetchDataGet } from "./helpers/fetchData";
import { useEffect, useState } from "react";

const Contacts = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const url = `${import.meta.env.VITE_BACKEND}/api/contacts`
        const fetchContacts = async () => {
            try {
                setLoading(true);
                const contacts = await fetchDataGet(url);
                setData(contacts);
                setError(null);
            } catch (err) {
                setError(err.message);
                setData(null)
            } finally {
                setLoading(false);
            }
        }
        fetchContacts();
    }, [])
    return (
        <>
            <h3>Contacts</h3>
            <ul>
                {data.map(contact => {
                    return <li key={contact.id}>
                        <p>{contact.username}</p>
                        <button>Message</button>
                    </li>
                })}
            </ul>
        </>
    )
}

export default Contacts;