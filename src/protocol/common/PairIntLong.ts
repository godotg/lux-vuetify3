

class PairIntLong {

    key: number = 0;
    value: number = 0;

    static PROTOCOL_ID: number = 110;

    protocolId(): number {
        return PairIntLong.PROTOCOL_ID;
    }

    static write(buffer: any, packet: PairIntLong | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeInt(packet.key);
        buffer.writeLong(packet.value);
    }

    static read(buffer: any): PairIntLong | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new PairIntLong();
        const result0 = buffer.readInt();
        packet.key = result0;
        const result1 = buffer.readLong();
        packet.value = result1;
        return packet;
    }
}

export default PairIntLong;
