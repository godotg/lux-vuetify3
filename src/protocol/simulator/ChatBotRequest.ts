import IByteBuffer from '../IByteBuffer';


class ChatBotRequest {

    requestId: number = 0;
    messages: Array<string> = [];

    static PROTOCOL_ID: number = 1100;

    protocolId(): number {
        return ChatBotRequest.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: ChatBotRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeStringList(packet.messages);
        buffer.writeLong(packet.requestId);
    }

    static read(buffer: IByteBuffer): ChatBotRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ChatBotRequest();
        const list0 = buffer.readStringList();
        packet.messages = list0;
        const result1 = buffer.readLong();
        packet.requestId = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ChatBotRequest;
