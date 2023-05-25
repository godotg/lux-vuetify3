

class ServerSessionActiveNotice {

    ipLong: number = 0;
    sid: number = 0;
    activeUid: number = 0;

    static PROTOCOL_ID: number = 250;

    protocolId(): number {
        return ServerSessionActiveNotice.PROTOCOL_ID;
    }

    static write(buffer: any, packet: ServerSessionActiveNotice | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.activeUid);
        buffer.writeLong(packet.ipLong);
        buffer.writeLong(packet.sid);
    }

    static read(buffer: any): ServerSessionActiveNotice | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new ServerSessionActiveNotice();
        const result0 = buffer.readLong();
        packet.activeUid = result0;
        const result1 = buffer.readLong();
        packet.ipLong = result1;
        const result2 = buffer.readLong();
        packet.sid = result2;
        return packet;
    }
}

export default ServerSessionActiveNotice;
