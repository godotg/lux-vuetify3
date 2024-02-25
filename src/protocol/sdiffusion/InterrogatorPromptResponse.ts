import IByteBuffer from '../IByteBuffer';


class InterrogatorPromptResponse {

    prompt: string = '';

    static PROTOCOL_ID: number = 334;

    protocolId(): number {
        return InterrogatorPromptResponse.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: InterrogatorPromptResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.prompt);
    }

    static read(buffer: IByteBuffer): InterrogatorPromptResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new InterrogatorPromptResponse();
        const result0 = buffer.readString();
        packet.prompt = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default InterrogatorPromptResponse;
