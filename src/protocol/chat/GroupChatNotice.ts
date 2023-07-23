import ChatMessage from './ChatMessage';


class GroupChatNotice {

    messages: Array<ChatMessage> = [];

    static PROTOCOL_ID: number = 241;

    protocolId(): number {
        return GroupChatNotice.PROTOCOL_ID;
    }

    static write(buffer: any, packet: GroupChatNotice | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacketList(packet.messages, 240);
    }

    static read(buffer: any): GroupChatNotice | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new GroupChatNotice();
        const list0 = buffer.readPacketList(240);
        packet.messages = list0;
        return packet;
    }
}

export default GroupChatNotice;
