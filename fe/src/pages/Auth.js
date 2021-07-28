import axios from 'axios';
import { useCallback, useEffect } from 'react';
import {
    useLocation,
    useHistory
} from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
  
const Auth = ({ setUser, user }) => {
    const history = useHistory();
    const query = useQuery();

    const getEmail = useCallback(async () => {
        const code = query.get('code');
        const state = query.get('state');

        console.log('auth response')
        const response = await axios.get('/api/login/auth', {
            params: { code, state }
        })

        setUser(response.data.email);
        history.push("/");
    }, [setUser, history, query]);

    useEffect(() => {
        if (user) { return; }
        getEmail();
    }, [getEmail, user]);

    return null;
};

export default Auth;