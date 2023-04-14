

class NoAnswerAttachment {

    taskExecutorHash: number = 0;

    static PROTOCOL_ID: number = 4

    protocolId(): number {
        return NoAnswerAttachment.PROTOCOL_ID;
    }

    static write(buffer: any, packet: NoAnswerAttachment | null) {
        if (buffer.writePacketFlag(packet)) {
            return;
        }
        if (packet === null) {
            return;
        }

        buffer.writeInt(packet.taskExecutorHash);
    }

    static read(buffer: any): NoAnswerAttachment | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new NoAnswerAttachment();
        const result0 = buffer.readInt();
        packet.taskExecutorHash = result0;
        return packet;
    }
}

export default NoAnswerAttachment;
