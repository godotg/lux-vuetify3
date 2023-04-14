

class AuthUidAsk {

    gatewayHostAndPort: string = '';
    sid: number = 0;
    uid: number = 0;

    static PROTOCOL_ID: number = 22

    protocolId(): number {
        return AuthUidAsk.PROTOCOL_ID;
    }

    static write(buffer: any, packet: AuthUidAsk | null) {
        if (buffer.writePacketFlag(packet)) {
            return;
        }
        if (packet === null) {
            return;
        }

        buffer.writeString(packet.gatewayHostAndPort);
        buffer.writeLong(packet.sid);
        buffer.writeLong(packet.uid);
    }

    static read(buffer: any): AuthUidAsk | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new AuthUidAsk();
        const result0 = buffer.readString();
        packet.gatewayHostAndPort = result0;
        const result1 = buffer.readLong();
        packet.sid = result1;
        const result2 = buffer.readLong();
        packet.uid = result2;
        return packet;
    }
}

export default AuthUidAsk;
