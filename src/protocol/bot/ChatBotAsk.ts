import IByteBuffer from '../IByteBuffer';


class ChatBotAsk {

    requestId: number = 0;
    message: string = '';

    static PROTOCOL_ID: number = 1002;

    protocolId(): number {
        return ChatBotAsk.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: ChatBotAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.message);
        buffer.writeInt(packet.requestId);
    }

    static read(buffer: IByteBuffer): ChatBotAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ChatBotAsk();
        const result0 = buffer.readString();
        packet.message = result0;
        const result1 = buffer.readInt();
        packet.requestId = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ChatBotAsk;
