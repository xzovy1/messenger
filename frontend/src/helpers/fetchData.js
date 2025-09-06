const mode = 'cors'

const fetchDataGet = async (url) => {
    const response = await fetch(url, {
        mode,
        headers: {
            "authorization": `bearer ${localStorage.jwt}`
        }
    })
    if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
    }
    return response.json();
}

const fetchDataPost = async (url, formData) => {
    const response = await fetch(url, {
        mode,
        headers: {
            "authorization": `bearer ${localStorage.jwt}`
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