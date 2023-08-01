

class StableDiffusionRequest {

    sampler_name: string = '';
    prompt: string = '';
    negative_prompt: string = '';
    seed: number = 0;
    steps: number = 0;
    batch_size: number = 0;
    width: number = 0;
    height: number = 0;

    static PROTOCOL_ID: number = 330;

    protocolId(): number {
        return StableDiffusionRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: StableDiffusionRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeInt(packet.batch_size);
        buffer.writeInt(packet.height);
        buffer.writeString(packet.negative_prompt);
        buffer.writeString(packet.prompt);
        buffer.writeString(packet.sampler_name);
        buffer.writeLong(packet.seed);
        buffer.writeInt(packet.steps);
        buffer.writeInt(packet.width);
    }

    static read(buffer: any): StableDiffusionRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new StableDiffusionRequest();
        const result0 = buffer.readInt();
        packet.batch_size = result0;
        const result1 = buffer.readInt();
        packet.height = result1;
        const result2 = buffer.readString();
        packet.negative_prompt = result2;
        const result3 = buffer.readString();
        packet.prompt = result3;
        const result4 = buffer.readString();
        packet.sampler_name = result4;
        const result5 = buffer.readLong();
        packet.seed = result5;
        const result6 = buffer.readInt();
        packet.steps = result6;
        const result7 = buffer.readInt();
        packet.width = result7;
        return packet;
    }
}

export default StableDiffusionRequest;
