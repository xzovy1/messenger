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
                console.log(contacts)
                setData(contacts);
                setError(null);
            } catch (err) {
                setError(err.message);
                setData(null)
                throw new Error(error)
            } finally {
                setLoading(false);
            }
        }
        fetchContacts();
    }, [])
    if (loading) {
        return <p>Loading Contacts...</p>
    }
    if (error) {
        return <p className="error">An Error has occured: {error}</p>
    }
    return (
        <>
            <h3>Contacts</h3>
            <ul>
                {data.map(contact => {
                    return <li key={contact.id}>
                        <img src={contact.image} />
                        <p>{contact.firstname} {contact.lastname}</p>
                        <p>@{contact.user.username}</p>
                        <button>Message</button>
                    </li>
                })}
            </ul>
        </>
    )
}

export default Contacts;