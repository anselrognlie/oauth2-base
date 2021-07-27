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

    const code = query.get('code');

    const getEmail = useCallback(async () => {
        console.log('auth response')
        const response = await axios.get('/api/login/auth', {
            params: {
                code: code
            }
        })

        setUser(response.data.email);
        history.push("/");
    }, [code, setUser, history]);

    useEffect(() => {
        if (user) { return; }
        getEmail();
    }, [getEmail, user]);

    return null;
};

export default Auth;