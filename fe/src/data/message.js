import { DateTime } from 'luxon';

class Message {
    constructor({ id, recipient_id, sender, sender_id, sent, text }) {
        this.id = id;
        this.recipient_id = recipient_id;
        this.sender = sender;
        this.sender_id = sender_id;
        this.sent = sent;
        this.text = text;
    }

    getSentFormatted() {
        return this.sent.toFormat('yyyy-MM-dd TT');
    }
}

Message.from_json_dict = (dict) => {
    const date = DateTime.fromISO(dict.sent)
    return new Message({ ...dict, sent: date });
};

export default Message;
