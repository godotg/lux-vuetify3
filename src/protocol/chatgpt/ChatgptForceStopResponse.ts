import IByteBuffer from '../IByteBuffer';


class ChatgptForceStopResponse {

    requestId: number = 0;

    static PROTOCOL_ID: number = 233;

    protocolId(): number {
        return ChatgptForceStopResponse.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: ChatgptForceStopResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.requestId);
    }

    static read(buffer: IByteBuffer): ChatgptForceStopResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ChatgptForceStopResponse();
        const result0 = buffer.readLong();
        packet.requestId = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ChatgptForceStopResponse;
