const mode = "cors";

const fetchDataGet = async (url) => {
  const response = await fetch(url, {
    mode,
    headers: {
      authorization: `bearer ${localStorage.jwt}`,
      // "content-type": "application/json",
    },
  }).then((response) => {
    if (response.status >= 400) {
      throw new Error(
        `Status ${response.status}, Message: ${response.statusText}`,
      );
    }
    return response.json();
  });
  return response;
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
    const error = await response.json()
    throw new Error(error.message);
  }
  return response.json();
};

export { fetchDataGet, fetchDataPost };
