

class LoginResponse {

    ip: string = '';
    ipLong: number = 0;
    sid: number = 0;
    activeUid: number = 0;
    region: string = '';
    newsIdDiff: number = 0;
    chatMessageIdDiff: number = 0;

    static PROTOCOL_ID: number = 251;

    protocolId(): number {
        return LoginResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: LoginResponse | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.activeUid);
        buffer.writeLong(packet.chatMessageIdDiff);
        buffer.writeString(packet.ip);
        buffer.writeLong(packet.ipLong);
        buffer.writeLong(packet.newsIdDiff);
        buffer.writeString(packet.region);
        buffer.writeLong(packet.sid);
    }

    static read(buffer: any): LoginResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new LoginResponse();
        const result0 = buffer.readLong();
        packet.activeUid = result0;
        const result1 = buffer.readLong();
        packet.chatMessageIdDiff = result1;
        const result2 = buffer.readString();
        packet.ip = result2;
        const result3 = buffer.readLong();
        packet.ipLong = result3;
        const result4 = buffer.readLong();
        packet.newsIdDiff = result4;
        const result5 = buffer.readString();
        packet.region = result5;
        const result6 = buffer.readLong();
        packet.sid = result6;
        return packet;
    }
}

export default LoginResponse;
