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

const fetchDataPost = async (url, method = "post", body) => {
  const response = await fetch(url, {
    mode,
    headers: {
      authorization: `bearer ${localStorage.jwt}`,
      "content-type": "application/json",
    },
    method,
    body,
  });
  if (!response.ok) {
    throw new Error(`HTTP error: Status ${response.status}`);
  }
  return response.json();
};

export { fetchDataGet, fetchDataPost };
