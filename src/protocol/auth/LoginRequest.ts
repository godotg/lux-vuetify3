

class LoginRequest {

    newsId: number = 0;
    chatMessageId: number = 0;

    static PROTOCOL_ID: number = 250;

    protocolId(): number {
        return LoginRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: LoginRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.chatMessageId);
        buffer.writeLong(packet.newsId);
    }

    static read(buffer: any): LoginRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new LoginRequest();
        const result0 = buffer.readLong();
        packet.chatMessageId = result0;
        const result1 = buffer.readLong();
        packet.newsId = result1;
        return packet;
    }
}

export default LoginRequest;
