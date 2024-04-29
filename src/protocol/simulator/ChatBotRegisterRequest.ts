import IByteBuffer from '../IByteBuffer';


class ChatBotRegisterRequest {

    

    static PROTOCOL_ID: number = 1102;

    protocolId(): number {
        return ChatBotRegisterRequest.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: ChatBotRegisterRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
    }

    static read(buffer: IByteBuffer): ChatBotRegisterRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ChatBotRegisterRequest();
        
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ChatBotRegisterRequest;
