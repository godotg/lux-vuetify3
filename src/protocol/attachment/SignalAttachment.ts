

class SignalAttachment {

    signalId: number = 0;
    taskExecutorHash: number = 0;
    // 0 for the server, 1 or 2 for the sync or async native client, 12 for the outside client such as browser, mobile
    client: number = 0;
    timestamp: number = 0;

    static PROTOCOL_ID: number = 0;

    protocolId(): number {
        return SignalAttachment.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SignalAttachment | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeByte(packet.client);
        buffer.writeInt(packet.signalId);
        buffer.writeInt(packet.taskExecutorHash);
        buffer.writeLong(packet.timestamp);
    }

    static read(buffer: any): SignalAttachment | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new SignalAttachment();
        const result0 = buffer.readByte();
        packet.client = result0;
        const result1 = buffer.readInt();
        packet.signalId = result1;
        const result2 = buffer.readInt();
        packet.taskExecutorHash = result2;
        const result3 = buffer.readLong();
        packet.timestamp = result3;
        return packet;
    }
}

export default SignalAttachment;
