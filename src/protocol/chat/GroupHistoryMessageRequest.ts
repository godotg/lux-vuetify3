

class GroupHistoryMessageRequest {

    groupId: number = 0;
    lastMessageId: number = 0;

    static PROTOCOL_ID: number = 243;

    protocolId(): number {
        return GroupHistoryMessageRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: GroupHistoryMessageRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.groupId);
        buffer.writeLong(packet.lastMessageId);
    }

    static read(buffer: any): GroupHistoryMessageRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new GroupHistoryMessageRequest();
        const result0 = buffer.readLong();
        packet.groupId = result0;
        const result1 = buffer.readLong();
        packet.lastMessageId = result1;
        return packet;
    }
}

export default GroupHistoryMessageRequest;
