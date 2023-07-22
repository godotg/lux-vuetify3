import StableDiffusionParameters from './StableDiffusionParameters';


class StableDiffusionResponse {

    images: Array<string> = [];
    parameters: StableDiffusionParameters | null = null;

    static PROTOCOL_ID: number = 331;

    protocolId(): number {
        return StableDiffusionResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: StableDiffusionResponse | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeStringList(packet.images);
        buffer.writePacket(packet.parameters, 332);
    }

    static read(buffer: any): StableDiffusionResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new StableDiffusionResponse();
        const list0 = buffer.readStringList();
        packet.images = list0;
        const result1 = buffer.readPacket(332);
        packet.parameters = result1;
        return packet;
    }
}

export default StableDiffusionResponse;
