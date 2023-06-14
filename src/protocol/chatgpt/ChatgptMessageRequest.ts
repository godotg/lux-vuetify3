

class ChatgptMessageRequest {

    requestId: number = 0;
    ai: number = 0;
    mobile: boolean = false;
    messages: Array<string> = [];

    static PROTOCOL_ID: number = 230;

    protocolId(): number {
        return ChatgptMessageRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: ChatgptMessageRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeInt(packet.ai);
        buffer.writeStringList(packet.messages);
        buffer.writeBoolean(packet.mobile);
        buffer.writeInt(packet.requestId);
    }

    static read(buffer: any): ChatgptMessageRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new ChatgptMessageRequest();
        const result0 = buffer.readInt();
        packet.ai = result0;
        const list1 = buffer.readStringList();
        packet.messages = list1;
        const result2 = buffer.readBoolean(); 
        packet.mobile = result2;
        const result3 = buffer.readInt();
        packet.requestId = result3;
        return packet;
    }
}

export default ChatgptMessageRequest;
