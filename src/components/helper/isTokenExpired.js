const getTokenExpiry = (token) => {
  try {
    const base64Payload = token.split(".")[1];

    const jsonString = atob(base64Payload);

    const payload = JSON.parse(jsonString);

    return payload.exp * 1000; // convert to ms
  } catch (error) {
    console.log(error);
    return null;
  }
}

const isTokenExpired = (token) => {
  const expiry = getTokenExpiry(token); // get expiry date time

  if(!expiry) return true; // if can't get expiry force to expire

  return Date.now() >= expiry; // true if expired
}

export { getTokenExpiry, isTokenExpired };