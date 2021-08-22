import { useContext } from "react";
import AuthContext from "../components/AuthContext";


const SocketIo = ({ socket }) => {
    const { token } = useContext(AuthContext);

    const onSendClicked = () => {
        if (! socket) { return; }

        console.log("send_message");
        socket.emit('send_message', token, {data: 'message!'});
    };

    return (
        <button onClick={onSendClicked}>Send</button>
    );
};

export default SocketIo;