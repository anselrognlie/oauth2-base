import { createContext } from "react";

const AuthContext = createContext({});

export const Auth = AuthContext.Provider;

export default AuthContext;