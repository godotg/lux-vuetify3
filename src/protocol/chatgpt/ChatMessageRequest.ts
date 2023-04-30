

class ChatMessageRequest {

    requestId: number = 0;
    messages: Array<string> = [];

    static PROTOCOL_ID: number = 230;

    protocolId(): number {
        return ChatMessageRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: ChatMessageRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeStringList(packet.messages);
        buffer.writeInt(packet.requestId);
    }

    static read(buffer: any): ChatMessageRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new ChatMessageRequest();
        const list0 = buffer.readStringList();
        packet.messages = list0;
        const result1 = buffer.readInt();
        packet.requestId = result1;
        return packet;
    }
}

export default ChatMessageRequest;
