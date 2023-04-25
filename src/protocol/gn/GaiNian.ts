

class GaiNian {

    id: number = 0;
    level: string = '';
    title: string = '';
    content: string = '';
    ctime: string = '';

    static PROTOCOL_ID: number = 220;

    protocolId(): number {
        return GaiNian.PROTOCOL_ID;
    }

    static write(buffer: any, packet: GaiNian | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.content);
        buffer.writeString(packet.ctime);
        buffer.writeLong(packet.id);
        buffer.writeString(packet.level);
        buffer.writeString(packet.title);
    }

    static read(buffer: any): GaiNian | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new GaiNian();
        const result0 = buffer.readString();
        packet.content = result0;
        const result1 = buffer.readString();
        packet.ctime = result1;
        const result2 = buffer.readLong();
        packet.id = result2;
        const result3 = buffer.readString();
        packet.level = result3;
        const result4 = buffer.readString();
        packet.title = result4;
        return packet;
    }
}

export default GaiNian;
