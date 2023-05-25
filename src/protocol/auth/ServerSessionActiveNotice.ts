

class ServerSessionActiveNotice {

    ip: string = '';
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
        buffer.writeString(packet.ip);
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
        const result1 = buffer.readString();
        packet.ip = result1;
        const result2 = buffer.readLong();
        packet.ipLong = result2;
        const result3 = buffer.readLong();
        packet.sid = result3;
        return packet;
    }
}

export default ServerSessionActiveNotice;
