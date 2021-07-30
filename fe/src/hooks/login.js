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
    const { decodedToken, isExpired } = decodeJwt(user?.token);
  
    const setLogin = useCallback((login) => {
      if (login) {
        localStorage.setItem("user", JSON.stringify(login));
      } else {
        localStorage.removeItem("user");
      }
  
      setUser(login);
    }, []);
  
    if (decodedToken && isExpired) {
      console.log("Authorization expired.");
      setLogin(null);
    }
  
    return [decodedToken, setLogin, user?.token ];
  };
  
  export default useLogin;
  