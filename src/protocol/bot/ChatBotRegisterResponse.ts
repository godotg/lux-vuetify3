import IByteBuffer from '../IByteBuffer';


class ChatBotRegisterResponse {

    

    static PROTOCOL_ID: number = 1103;

    protocolId(): number {
        return ChatBotRegisterResponse.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: ChatBotRegisterResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
    }

    static read(buffer: IByteBuffer): ChatBotRegisterResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ChatBotRegisterResponse();
        
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ChatBotRegisterResponse;
