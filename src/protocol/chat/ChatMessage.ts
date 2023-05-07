

class ChatMessage {

    id: number = 0;
    type: number = 0;
    sendId: number = 0;
    message: string = '';
    timestamp: number = 0;

    static PROTOCOL_ID: number = 240;

    protocolId(): number {
        return ChatMessage.PROTOCOL_ID;
    }

    static write(buffer: any, packet: ChatMessage | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.id);
        buffer.writeString(packet.message);
        buffer.writeLong(packet.sendId);
        buffer.writeLong(packet.timestamp);
        buffer.writeByte(packet.type);
    }

    static read(buffer: any): ChatMessage | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new ChatMessage();
        const result0 = buffer.readLong();
        packet.id = result0;
        const result1 = buffer.readString();
        packet.message = result1;
        const result2 = buffer.readLong();
        packet.sendId = result2;
        const result3 = buffer.readLong();
        packet.timestamp = result3;
        const result4 = buffer.readByte();
        packet.type = result4;
        return packet;
    }
}

export default ChatMessage;
