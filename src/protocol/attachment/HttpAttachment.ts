

class HttpAttachment {

    uid: number = 0;
    taskExecutorHash: number = 0;

    static PROTOCOL_ID: number = 4;

    protocolId(): number {
        return HttpAttachment.PROTOCOL_ID;
    }

    static write(buffer: any, packet: HttpAttachment | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeInt(packet.taskExecutorHash);
        buffer.writeLong(packet.uid);
    }

    static read(buffer: any): HttpAttachment | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new HttpAttachment();
        const result0 = buffer.readInt();
        packet.taskExecutorHash = result0;
        const result1 = buffer.readLong();
        packet.uid = result1;
        return packet;
    }
}

export default HttpAttachment;
