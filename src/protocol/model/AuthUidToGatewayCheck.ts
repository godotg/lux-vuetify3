

class AuthUidToGatewayCheck {

    uid: number = 0;

    static PROTOCOL_ID: number = 20

    protocolId(): number {
        return AuthUidToGatewayCheck.PROTOCOL_ID;
    }

    static write(buffer: any, packet: AuthUidToGatewayCheck | null) {
        if (buffer.writePacketFlag(packet)) {
            return;
        }
        if (packet === null) {
            return;
        }

        buffer.writeLong(packet.uid);
    }

    static read(buffer: any): AuthUidToGatewayCheck | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new AuthUidToGatewayCheck();
        const result0 = buffer.readLong();
        packet.uid = result0;
        return packet;
    }
}

export default AuthUidToGatewayCheck;
