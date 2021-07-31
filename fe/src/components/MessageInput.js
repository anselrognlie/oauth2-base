import { useState } from "react";

const FIELDS = ['text'];

const makeDefaultFormStateFor = (fields) => {
    const state = {};
    for (const field of fields) {
        state[field] = '';
    }

    return state;
};

const makeDefaultFormState = () => {
    return makeDefaultFormStateFor(FIELDS);
}


const MessageInput = ({ sendHandler }) => {
    const [inputs, setInputs] = useState(makeDefaultFormState);
    const fields = FIELDS;

    const onChange = (e) => {
        setInputs(old => (
            {...inputs, [e.target.name]: e.target.value}
        ));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        sendHandler(inputs);
        setInputs(makeDefaultFormState());
    };

    return (
        <form onSubmit={onSubmit}>
            { fields.map(field => (
                <input key={field} type="text" name={field} value={inputs[field]} onChange={onChange}></input>
            )) }
            <input type="submit" value="Send"></input>
        </form>
    );
};

export default MessageInput;