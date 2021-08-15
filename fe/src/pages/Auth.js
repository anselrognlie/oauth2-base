import axios from 'axios';
import { useCallback, useEffect } from 'react';
import {
    useLocation,
} from 'react-router-dom';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}
  
const Auth = ({ onUserLoggedIn, onLoginFailed }) => {
    const query = useQuery();

    const code = query.get('code');
    const state = query.get('state');

    const getToken = useCallback(async () => {
        try {
            const response = await axios.get('/api/login/auth', {
                params: { code, state }
            })

            onUserLoggedIn(response.data.token);
        } catch (error) {
            console.log(error.response.data);

            onLoginFailed()
        }
    }, [onUserLoggedIn, onLoginFailed, code, state]);

    useEffect(() => {
        getToken();
    }, [getToken]);

    return null;
};

export default Auth;