

class StableDiffusionParameters {

    prompt: string = '';
    sampler_index: string = '';
    seed: number = 0;
    steps: number = 0;
    cfg_scale: number = 0;
    batch_size: number = 0;
    width: number = 0;
    height: number = 0;
    restore_faces: boolean = false;
    tiling: boolean = false;

    static PROTOCOL_ID: number = 332;

    protocolId(): number {
        return StableDiffusionParameters.PROTOCOL_ID;
    }

    static write(buffer: any, packet: StableDiffusionParameters | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeInt(packet.batch_size);
        buffer.writeInt(packet.cfg_scale);
        buffer.writeInt(packet.height);
        buffer.writeString(packet.prompt);
        buffer.writeBoolean(packet.restore_faces);
        buffer.writeString(packet.sampler_index);
        buffer.writeInt(packet.seed);
        buffer.writeInt(packet.steps);
        buffer.writeBoolean(packet.tiling);
        buffer.writeInt(packet.width);
    }

    static read(buffer: any): StableDiffusionParameters | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new StableDiffusionParameters();
        const result0 = buffer.readInt();
        packet.batch_size = result0;
        const result1 = buffer.readInt();
        packet.cfg_scale = result1;
        const result2 = buffer.readInt();
        packet.height = result2;
        const result3 = buffer.readString();
        packet.prompt = result3;
        const result4 = buffer.readBoolean(); 
        packet.restore_faces = result4;
        const result5 = buffer.readString();
        packet.sampler_index = result5;
        const result6 = buffer.readInt();
        packet.seed = result6;
        const result7 = buffer.readInt();
        packet.steps = result7;
        const result8 = buffer.readBoolean(); 
        packet.tiling = result8;
        const result9 = buffer.readInt();
        packet.width = result9;
        return packet;
    }
}

export default StableDiffusionParameters;
