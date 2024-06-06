import IByteBuffer from '../IByteBuffer';

class GroupHistoryMessageRequest {
    groupId: number = 0;
    lastMessageId: number = 0;

    static PROTOCOL_ID: number = 243;

    protocolId(): number {
        return GroupHistoryMessageRequest.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: GroupHistoryMessageRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.groupId);
        buffer.writeLong(packet.lastMessageId);
    }

    static read(buffer: IByteBuffer): GroupHistoryMessageRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new GroupHistoryMessageRequest();
        const result0 = buffer.readLong();
        packet.groupId = result0;
        const result1 = buffer.readLong();
        packet.lastMessageId = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default GroupHistoryMessageRequest;