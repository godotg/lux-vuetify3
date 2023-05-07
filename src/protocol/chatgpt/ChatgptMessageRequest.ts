

class ChatgptMessageRequest {

    requestId: number = 0;
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
        buffer.writeStringList(packet.messages);
        buffer.writeBoolean(packet.mobile);
        buffer.writeInt(packet.requestId);
    }

    static read(buffer: any): ChatgptMessageRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new ChatgptMessageRequest();
        const list0 = buffer.readStringList();
        packet.messages = list0;
        const result1 = buffer.readBoolean(); 
        packet.mobile = result1;
        const result2 = buffer.readInt();
        packet.requestId = result2;
        return packet;
    }
}

export default ChatgptMessageRequest;
