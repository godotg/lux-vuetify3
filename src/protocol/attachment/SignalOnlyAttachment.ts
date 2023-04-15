

class SignalOnlyAttachment {

    signalId: number = 0;
    timestamp: number = 0;

    static PROTOCOL_ID: number = 1;

    protocolId(): number {
        return SignalOnlyAttachment.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SignalOnlyAttachment | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeInt(packet.signalId);
        buffer.writeLong(packet.timestamp);
    }

    static read(buffer: any): SignalOnlyAttachment | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new SignalOnlyAttachment();
        const result0 = buffer.readInt();
        packet.signalId = result0;
        const result1 = buffer.readLong();
        packet.timestamp = result1;
        return packet;
    }
}

export default SignalOnlyAttachment;
