

class AuthUidToGatewayConfirm {

    uid: number = 0;

    static PROTOCOL_ID: number = 21;

    protocolId(): number {
        return AuthUidToGatewayConfirm.PROTOCOL_ID;
    }

    static write(buffer: any, packet: AuthUidToGatewayConfirm | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.uid);
    }

    static read(buffer: any): AuthUidToGatewayConfirm | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new AuthUidToGatewayConfirm();
        const result0 = buffer.readLong();
        packet.uid = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default AuthUidToGatewayConfirm;
