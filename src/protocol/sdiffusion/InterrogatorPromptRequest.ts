

class InterrogatorPromptRequest {

    image: string = '';
    clip_model_name: string = '';
    mode: string = '';

    static PROTOCOL_ID: number = 333;

    protocolId(): number {
        return InterrogatorPromptRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: InterrogatorPromptRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.clip_model_name);
        buffer.writeString(packet.image);
        buffer.writeString(packet.mode);
    }

    static read(buffer: any): InterrogatorPromptRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new InterrogatorPromptRequest();
        const result0 = buffer.readString();
        packet.clip_model_name = result0;
        const result1 = buffer.readString();
        packet.image = result1;
        const result2 = buffer.readString();
        packet.mode = result2;
        return packet;
    }
}

export default InterrogatorPromptRequest;
