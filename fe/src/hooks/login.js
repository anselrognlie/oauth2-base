import { useCallback, useState } from 'react';
import { decodeToken, isExpired } from "react-jwt";

const readToken = () => {
  return localStorage.getItem("token");
};

const decodeJwt = (token) => {
  const decodedToken = decodeToken(token);
  const isTokenExpired = isExpired(token);
  
  return { user: decodedToken, isExpired: isTokenExpired }
};

const useLogin = () => {
  const [token, setTokenInternal] = useState(readToken);

  const setToken = useCallback((token) => {
    setTokenInternal(token);

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, []);

  const { user, isExpired } = decodeJwt(token);

  if (user && isExpired) {
    console.log("Authorization expired.");
    setToken(null);
  }

  return [ user, token, setToken ];
};

export default useLogin;
