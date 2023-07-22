

class SdSimulateRequest {

    nonce: number = 0;
    prompt: string = '';
    negativePrompt: string = '';
    steps: number = 0;
    batchSize: number = 0;
    // 图片的风格，0->二次元
    style: number = 0;
    // 图片的尺寸，0->768*768，1->768*1024
    dimension: number = 0;
    ignores: Array<number> = [];

    static PROTOCOL_ID: number = 340;

    protocolId(): number {
        return SdSimulateRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SdSimulateRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeInt(packet.batchSize);
        buffer.writeInt(packet.dimension);
        buffer.writeLongList(packet.ignores);
        buffer.writeString(packet.negativePrompt);
        buffer.writeLong(packet.nonce);
        buffer.writeString(packet.prompt);
        buffer.writeInt(packet.steps);
        buffer.writeInt(packet.style);
    }

    static read(buffer: any): SdSimulateRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new SdSimulateRequest();
        const result0 = buffer.readInt();
        packet.batchSize = result0;
        const result1 = buffer.readInt();
        packet.dimension = result1;
        const list2 = buffer.readLongList();
        packet.ignores = list2;
        const result3 = buffer.readString();
        packet.negativePrompt = result3;
        const result4 = buffer.readLong();
        packet.nonce = result4;
        const result5 = buffer.readString();
        packet.prompt = result5;
        const result6 = buffer.readInt();
        packet.steps = result6;
        const result7 = buffer.readInt();
        packet.style = result7;
        return packet;
    }
}

export default SdSimulateRequest;
