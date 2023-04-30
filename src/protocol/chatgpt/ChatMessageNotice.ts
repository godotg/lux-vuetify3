

class ChatMessageNotice {

    requestId: number = 0;
    choice: string = '';

    static PROTOCOL_ID: number = 231;

    protocolId(): number {
        return ChatMessageNotice.PROTOCOL_ID;
    }

    static write(buffer: any, packet: ChatMessageNotice | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.choice);
        buffer.writeInt(packet.requestId);
    }

    static read(buffer: any): ChatMessageNotice | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new ChatMessageNotice();
        const result0 = buffer.readString();
        packet.choice = result0;
        const result1 = buffer.readInt();
        packet.requestId = result1;
        return packet;
    }
}

export default ChatMessageNotice;
