

class ImageDownloadResponse {

    realUrl: string = '';

    static PROTOCOL_ID: number = 346;

    protocolId(): number {
        return ImageDownloadResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: ImageDownloadResponse | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.realUrl);
    }

    static read(buffer: any): ImageDownloadResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new ImageDownloadResponse();
        const result0 = buffer.readString();
        packet.realUrl = result0;
        return packet;
    }
}

export default ImageDownloadResponse;
