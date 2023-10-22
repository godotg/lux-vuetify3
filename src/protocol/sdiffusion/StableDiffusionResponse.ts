import StableDiffusionParameters from './StableDiffusionParameters';


class StableDiffusionResponse {

    images: Array<string> = [];
    parameters: StableDiffusionParameters | null = null;

    static PROTOCOL_ID: number = 331;

    protocolId(): number {
        return StableDiffusionResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: StableDiffusionResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeStringList(packet.images);
        buffer.writePacket(packet.parameters, 332);
    }

    static read(buffer: any): StableDiffusionResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new StableDiffusionResponse();
        const list0 = buffer.readStringList();
        packet.images = list0;
        const result1 = buffer.readPacket(332);
        packet.parameters = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default StableDiffusionResponse;
