import { useCallback, useEffect, useRef, useState, useContext } from "react";
import { addToken } from "../util/tokenLib";
import MessageInput from "../components/MessageInput";
import axios from 'axios';
import './Lobby.css';
import Message from "../data/message";
import AuthContext from "../components/AuthContext";
import { DateTime } from 'luxon';

const getSince = () => {
        const now = DateTime.now();
        return now.minus({minutes: 10});
};

const makeOpts = (since, latestId) => {
    const opts = { params: { since: since.toISO() } };

    if (latestId) {
        opts.params.latestId = latestId;
    }

    return opts;
};

const Lobby = () => {
    const chat = useRef([]);
    const [latestId, setLatestId] = useState(null);
    const [since] = useState(getSince());
    const { user, token } = useContext(AuthContext);

    const getMessages = useCallback(async (since, latestId) => {
        try {
            const opts = makeOpts(since, latestId);
            const response = await axios.get('/api/messages', addToken(token, opts))
            chat.current.push(...response.data.map(Message.from_json_dict));
            if (chat.current.length) {
                const newMostRecent = chat.current.slice(-1)[0].id;
                setLatestId(newMostRecent);
            }
        } catch (error) {
            console.log(error.response.data);
            chat.current = []
            setLatestId(null);
        }
    }, [token]);

    useEffect(() => {
        getMessages(since, latestId);
    }, [getMessages, since, latestId]);

    const sendMessage = async (text) => {
        try {
            const payload = {
                sender_id: user.id,
                text: text
            };

            await axios.post('/api/messages', payload, addToken(token))
        } catch (error) {
            console.log(error.response.data);
        }
    };

    const sendHandler = async (inputs) => {
        await sendMessage(inputs.text);
        await getMessages(since, latestId);
    };

    return (
        <div className="Lobby">
            <div className="chat">
                <div className="chat-log">
                    { chat.current.map(message => (
                        <div key={message.id} className="chat-msg">
                            <div className="chat-msg__from">{message.sender}</div>{' '}
                            <div className="chat-msg__sent">({message.getSentFormatted()})</div>{': '}
                            <div className="chat-msg__text">{message.text}</div>
                        </div>
                    )) }
                </div>
                <div className="chat-input">
                    <MessageInput {...{sendHandler}} />
                </div>
            </div>
        </div>
    );
};

export default Lobby;