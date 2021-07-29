import { useCallback, useEffect, useState } from "react";
import axios from 'axios';

const Number = ({ token }) => {
    const [number, setNumber] = useState(null);

    const getNumber = useCallback(async () => {
        const response = await axios.get('/api/number', {
            headers: {
                Authorization: `JWT ${token}`
            }
        })
        setNumber(response.data.number);
    }, [token]);

    useEffect(() => {
        getNumber();
    }, [getNumber]);

    return (
        number != null && <span>{number}</span>
    );
};

export default Number;