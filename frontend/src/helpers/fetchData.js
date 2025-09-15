const mode = "cors";

const fetchDataGet = async (url) => {
  const response = await fetch(url, {
    mode,
    headers: {
      authorization: `bearer ${localStorage.jwt}`,
      // "content-type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error: Status ${response.status}`);
  }
  return response.json();
};

const fetchDataPost = async (url, formData) => {
  const response = await fetch(url, {
    mode,
    headers: {
      authorization: `bearer ${localStorage.jwt}`,
      // 'content-type': 'application/json'
    },
    method: "post",
    body: new URLSearchParams(formData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error: Status ${response.status}`);
  }
  return response.json();
};

export { fetchDataGet, fetchDataPost };
