

class ImageDeleteAsk {

    realUrl: string = '';

    static PROTOCOL_ID: number = 347;

    protocolId(): number {
        return ImageDeleteAsk.PROTOCOL_ID;
    }

    static write(buffer: any, packet: ImageDeleteAsk | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.realUrl);
    }

    static read(buffer: any): ImageDeleteAsk | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new ImageDeleteAsk();
        const result0 = buffer.readString();
        packet.realUrl = result0;
        return packet;
    }
}

export default ImageDeleteAsk;
