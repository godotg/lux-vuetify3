

class OssPolicyVO {

    policy: string = '';
    accessKeyId: string = '';
    signature: string = '';
    dir: string = '';
    host: string = '';
    expire: string = '';

    static PROTOCOL_ID: number = 254;

    protocolId(): number {
        return OssPolicyVO.PROTOCOL_ID;
    }

    static write(buffer: any, packet: OssPolicyVO | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.accessKeyId);
        buffer.writeString(packet.dir);
        buffer.writeString(packet.expire);
        buffer.writeString(packet.host);
        buffer.writeString(packet.policy);
        buffer.writeString(packet.signature);
    }

    static read(buffer: any): OssPolicyVO | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new OssPolicyVO();
        const result0 = buffer.readString();
        packet.accessKeyId = result0;
        const result1 = buffer.readString();
        packet.dir = result1;
        const result2 = buffer.readString();
        packet.expire = result2;
        const result3 = buffer.readString();
        packet.host = result3;
        const result4 = buffer.readString();
        packet.policy = result4;
        const result5 = buffer.readString();
        packet.signature = result5;
        return packet;
    }
}

export default OssPolicyVO;
