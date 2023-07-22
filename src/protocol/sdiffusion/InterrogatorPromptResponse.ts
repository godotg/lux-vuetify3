

class InterrogatorPromptResponse {

    prompt: string = '';

    static PROTOCOL_ID: number = 334;

    protocolId(): number {
        return InterrogatorPromptResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: InterrogatorPromptResponse | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.prompt);
    }

    static read(buffer: any): InterrogatorPromptResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new InterrogatorPromptResponse();
        const result0 = buffer.readString();
        packet.prompt = result0;
        return packet;
    }
}

export default InterrogatorPromptResponse;
