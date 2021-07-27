import { useEffect, useState } from "react";
import axios from 'axios';

const Number = () => {
    const [number, setNumber] = useState(null);

    const getNumber = async () => {
        const response = await axios.get('/api/number')
        setNumber(response.data.number);
    };

    useEffect(() => {
        getNumber();
    }, []);

    return (
        number != null && <span>{number}</span>
    );
};

export default Number;