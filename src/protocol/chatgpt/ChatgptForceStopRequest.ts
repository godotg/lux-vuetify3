import IByteBuffer from '../IByteBuffer';

class ChatgptForceStopRequest {
    requestId: number = 0;

    static PROTOCOL_ID: number = 232;

    protocolId(): number {
        return ChatgptForceStopRequest.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: ChatgptForceStopRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.requestId);
    }

    static read(buffer: IByteBuffer): ChatgptForceStopRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ChatgptForceStopRequest();
        const result0 = buffer.readLong();
        packet.requestId = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ChatgptForceStopRequest;