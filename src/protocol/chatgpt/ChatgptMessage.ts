import IByteBuffer from '../IByteBuffer';

class ChatgptMessage {
    role: string = '';
    content: string = '';

    static PROTOCOL_ID: number = 234;

    protocolId(): number {
        return ChatgptMessage.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: ChatgptMessage | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.content);
        buffer.writeString(packet.role);
    }

    static read(buffer: IByteBuffer): ChatgptMessage | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ChatgptMessage();
        const result0 = buffer.readString();
        packet.content = result0;
        const result1 = buffer.readString();
        packet.role = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ChatgptMessage;