import IByteBuffer from '../IByteBuffer';


class ChatBotNotice {

    requestId: number = 0;
    spider: number = 0;
    choice: string = '';
    finishReason: number = 0;

    static PROTOCOL_ID: number = 1101;

    protocolId(): number {
        return ChatBotNotice.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: ChatBotNotice | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.choice);
        buffer.writeInt(packet.finishReason);
        buffer.writeInt(packet.requestId);
        buffer.writeInt(packet.spider);
    }

    static read(buffer: IByteBuffer): ChatBotNotice | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ChatBotNotice();
        const result0 = buffer.readString();
        packet.choice = result0;
        const result1 = buffer.readInt();
        packet.finishReason = result1;
        const result2 = buffer.readInt();
        packet.requestId = result2;
        const result3 = buffer.readInt();
        packet.spider = result3;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ChatBotNotice;
