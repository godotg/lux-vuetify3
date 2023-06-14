

class TripleLong {

    left: number = 0;
    middle: number = 0;
    right: number = 0;

    static PROTOCOL_ID: number = 114;

    protocolId(): number {
        return TripleLong.PROTOCOL_ID;
    }

    static write(buffer: any, packet: TripleLong | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.left);
        buffer.writeLong(packet.middle);
        buffer.writeLong(packet.right);
    }

    static read(buffer: any): TripleLong | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new TripleLong();
        const result0 = buffer.readLong();
        packet.left = result0;
        const result1 = buffer.readLong();
        packet.middle = result1;
        const result2 = buffer.readLong();
        packet.right = result2;
        return packet;
    }
}

export default TripleLong;
