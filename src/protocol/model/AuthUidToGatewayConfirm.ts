

class AuthUidToGatewayConfirm {

    uid: number = 0;

    static PROTOCOL_ID: number = 21;

    protocolId(): number {
        return AuthUidToGatewayConfirm.PROTOCOL_ID;
    }

    static write(buffer: any, packet: AuthUidToGatewayConfirm | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.uid);
    }

    static read(buffer: any): AuthUidToGatewayConfirm | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new AuthUidToGatewayConfirm();
        const result0 = buffer.readLong();
        packet.uid = result0;
        return packet;
    }
}

export default AuthUidToGatewayConfirm;
