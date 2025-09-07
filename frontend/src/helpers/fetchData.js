const mode = 'cors'
const contentType = { "content-type": "application/json" }

const fetchDataGet = async (url, signal = null) => {
    const response = await fetch(url, {
        signal,
        mode,
        headers: {
            "authorization": `bearer ${localStorage.jwt}`,
            contentType
        }
    })
    if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
    }
    return response.json();
}

const fetchDataPost = async (url, signal = null, formData) => {
    const response = await fetch(url, {
        signal,
        mode,
        headers: {
            "authorization": `bearer ${localStorage.jwt}`,
            contentType
        },
        method: 'post',
        body: new URLSearchParams(formData)
    })
    if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
    }
    return response.json();
}

export { fetchDataGet, fetchDataPost }