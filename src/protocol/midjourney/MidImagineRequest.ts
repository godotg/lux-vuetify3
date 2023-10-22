

class MidImagineRequest {

    nonce: string = '';
    prompt: string = '';

    static PROTOCOL_ID: number = 270;

    protocolId(): number {
        return MidImagineRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidImagineRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.nonce);
        buffer.writeString(packet.prompt);
    }

    static read(buffer: any): MidImagineRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MidImagineRequest();
        const result0 = buffer.readString();
        packet.nonce = result0;
        const result1 = buffer.readString();
        packet.prompt = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default MidImagineRequest;
