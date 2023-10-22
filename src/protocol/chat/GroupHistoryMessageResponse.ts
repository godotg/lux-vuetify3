import ChatMessage from './ChatMessage';


class GroupHistoryMessageResponse {

    groupId: number = 0;
    messages: Array<ChatMessage> = [];
    onlineUsers: number = 0;

    static PROTOCOL_ID: number = 244;

    protocolId(): number {
        return GroupHistoryMessageResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: GroupHistoryMessageResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.groupId);
        buffer.writePacketList(packet.messages, 240);
        buffer.writeInt(packet.onlineUsers);
    }

    static read(buffer: any): GroupHistoryMessageResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new GroupHistoryMessageResponse();
        const result0 = buffer.readLong();
        packet.groupId = result0;
        const list1 = buffer.readPacketList(240);
        packet.messages = list1;
        const result2 = buffer.readInt();
        packet.onlineUsers = result2;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default GroupHistoryMessageResponse;
