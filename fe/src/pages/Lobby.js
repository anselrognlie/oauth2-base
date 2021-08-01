import { useCallback, useEffect, useRef, useState, useContext } from "react";
import { addToken } from "../util/tokenLib";
import MessageInput from "../components/MessageInput";
import axios from 'axios';
import './Lobby.css';
import Message from "../data/message";
import AuthContext from "../components/AuthContext";

const Lobby = () => {
    const chat = useRef([]);
    const [mostRecent, setMostRecent] = useState(null);
    const { user, token } = useContext(AuthContext);

    const getMessages = useCallback(async (latestId) => {
        try {
            const opts = {};
            if (latestId) {
                opts.params = { latestId: latestId };
            }

            const response = await axios.get('/api/messages', addToken(token, opts))
            chat.current.push(...response.data.map(Message.from_json_dict));
            if (chat.current.length) {
                const newMostRecent = chat.current.slice(-1)[0].id;
                setMostRecent(newMostRecent);
            }
        } catch (error) {
            console.log(error.response.data);
            chat.current = []
            setMostRecent(null);
        }
    }, [token]);

    useEffect(() => {
        getMessages();
    }, [getMessages]);

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
        await getMessages(mostRecent);
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