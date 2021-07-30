import axios from 'axios';
import { useCallback, useEffect } from 'react';
import {
    useLocation,
} from 'react-router-dom';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}
  
const Auth = ({ onUserLoggedIn }) => {
    const query = useQuery();

    const code = query.get('code');
    const state = query.get('state');

    const getUser = useCallback(async () => {
        try {
            const response = await axios.get('/api/login/auth', {
                params: { code, state }
            })

            onUserLoggedIn(response.data);
        } catch (error) {
            console.log(error.response.data);
        }
    }, [onUserLoggedIn, code, state]);

    useEffect(() => {
        getUser();
    }, [getUser]);

    return null;
};

export default Auth;