import { useCallback, useEffect, useState } from "react";
import { addToken } from "../util/tokenLib";
import axios from 'axios';

const Number = ({ token }) => {
    const [number, setNumber] = useState(null);

    const getNumber = useCallback(async () => {
        try {
            const response = await axios.get('/api/number', addToken(token))
            setNumber(response.data.number);
        } catch (error) {
            console.log(error.response.data);
            setNumber(null);
        }
    }, [token]);

    useEffect(() => {
        getNumber();
    }, [getNumber]);

    return (
        number != null && <span>{number}</span>
    );
};

export default Number;