

class ChatgptForceStopRequest {

    requestId: number = 0;

    static PROTOCOL_ID: number = 232;

    protocolId(): number {
        return ChatgptForceStopRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: ChatgptForceStopRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeInt(packet.requestId);
    }

    static read(buffer: any): ChatgptForceStopRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new ChatgptForceStopRequest();
        const result0 = buffer.readInt();
        packet.requestId = result0;
        return packet;
    }
}

export default ChatgptForceStopRequest;
