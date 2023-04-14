

class HttpAttachment {

    uid: number = 0;
    useTaskExecutorHashParam: boolean = false;
    taskExecutorHashParam: number = 0;

    static PROTOCOL_ID: number = 3

    protocolId(): number {
        return HttpAttachment.PROTOCOL_ID;
    }

    static write(buffer: any, packet: HttpAttachment | null) {
        if (buffer.writePacketFlag(packet)) {
            return;
        }
        if (packet === null) {
            return;
        }

        buffer.writeInt(packet.taskExecutorHashParam);
        buffer.writeLong(packet.uid);
        buffer.writeBoolean(packet.useTaskExecutorHashParam);
    }

    static read(buffer: any): HttpAttachment | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new HttpAttachment();
        const result0 = buffer.readInt();
        packet.taskExecutorHashParam = result0;
        const result1 = buffer.readLong();
        packet.uid = result1;
        const result2 = buffer.readBoolean(); 
        packet.useTaskExecutorHashParam = result2;
        return packet;
    }
}

export default HttpAttachment;
