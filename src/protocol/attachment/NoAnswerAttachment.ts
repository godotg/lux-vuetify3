import IByteBuffer from '../IByteBuffer';

class NoAnswerAttachment {
    taskExecutorHash: number = 0;

    static PROTOCOL_ID: number = 5;

    protocolId(): number {
        return NoAnswerAttachment.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: NoAnswerAttachment | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeInt(packet.taskExecutorHash);
    }

    static read(buffer: IByteBuffer): NoAnswerAttachment | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new NoAnswerAttachment();
        const result0 = buffer.readInt();
        packet.taskExecutorHash = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default NoAnswerAttachment;