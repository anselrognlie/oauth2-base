import { useCallback, useState } from 'react';
import { decodeToken, isExpired } from "react-jwt";

const readUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    }
    catch {
      return null;
    }
  };
  
  const decodeJwt = (token) => {
    const decodedToken = decodeToken(token);
    const isTokenExpired = isExpired(token);
  
    return { decodedToken, isExpired: isTokenExpired }
  };
  
  const useLogin = (account) => {
    const localUser = readUser();
    const [user, setUser] = useState(localUser);
    const [decodedToken, setDecodedToken] = useState(null);
    const [isExpired, setIsExpired] = useState(false);
  
    const setLogin = useCallback((login) => {
      setUser(login);

      if (login) {
        localStorage.setItem("user", JSON.stringify(login));
        const { decodedToken, isExpired } = decodeJwt(login.token);
        setDecodedToken(decodedToken);
        setIsExpired(isExpired);
      } else {
        localStorage.removeItem("user");
        setDecodedToken(null);
      }
    }, []);
  
    if (decodedToken && isExpired) {
      console.log("Authorization expired.");
      setLogin(null);
    }
  
    return [decodedToken, setLogin, user?.token ];
  };
  
  export default useLogin;
  