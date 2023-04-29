

class ChatMessageResponse {

    choices: Array<string> = [];

    static PROTOCOL_ID: number = 231;

    protocolId(): number {
        return ChatMessageResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: ChatMessageResponse | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeStringList(packet.choices);
    }

    static read(buffer: any): ChatMessageResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new ChatMessageResponse();
        const list0 = buffer.readStringList();
        packet.choices = list0;
        return packet;
    }
}

export default ChatMessageResponse;
