

class Pong {

    time: number = 0;

    static PROTOCOL_ID: number = 104;

    protocolId(): number {
        return Pong.PROTOCOL_ID;
    }

    static write(buffer: any, packet: Pong | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.time);
    }

    static read(buffer: any): Pong | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new Pong();
        const result0 = buffer.readLong();
        packet.time = result0;
        return packet;
    }
}

export default Pong;
