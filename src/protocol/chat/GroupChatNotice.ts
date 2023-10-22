import ChatMessage from './ChatMessage';


class GroupChatNotice {

    messages: Array<ChatMessage> = [];

    static PROTOCOL_ID: number = 241;

    protocolId(): number {
        return GroupChatNotice.PROTOCOL_ID;
    }

    static write(buffer: any, packet: GroupChatNotice | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacketList(packet.messages, 240);
    }

    static read(buffer: any): GroupChatNotice | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new GroupChatNotice();
        const list0 = buffer.readPacketList(240);
        packet.messages = list0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default GroupChatNotice;
