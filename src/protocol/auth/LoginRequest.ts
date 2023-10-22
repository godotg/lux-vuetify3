

class LoginRequest {

    newsId: number = 0;
    chatMessageId: number = 0;

    static PROTOCOL_ID: number = 250;

    protocolId(): number {
        return LoginRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: LoginRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.chatMessageId);
        buffer.writeLong(packet.newsId);
    }

    static read(buffer: any): LoginRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new LoginRequest();
        const result0 = buffer.readLong();
        packet.chatMessageId = result0;
        const result1 = buffer.readLong();
        packet.newsId = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default LoginRequest;
