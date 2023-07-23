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
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.groupId);
        buffer.writePacketList(packet.messages, 240);
        buffer.writeInt(packet.onlineUsers);
    }

    static read(buffer: any): GroupHistoryMessageResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new GroupHistoryMessageResponse();
        const result0 = buffer.readLong();
        packet.groupId = result0;
        const list1 = buffer.readPacketList(240);
        packet.messages = list1;
        const result2 = buffer.readInt();
        packet.onlineUsers = result2;
        return packet;
    }
}

export default GroupHistoryMessageResponse;
