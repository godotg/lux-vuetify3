

class ChatMessageRequest {

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
    }

    static read(buffer: any): ChatMessageRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new ChatMessageRequest();
        const list0 = buffer.readStringList();
        packet.messages = list0;
        return packet;
    }
}

export default ChatMessageRequest;
