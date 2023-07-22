

class ImageDownloadRequest {

    url: string = '';

    static PROTOCOL_ID: number = 345;

    protocolId(): number {
        return ImageDownloadRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: ImageDownloadRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.url);
    }

    static read(buffer: any): ImageDownloadRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new ImageDownloadRequest();
        const result0 = buffer.readString();
        packet.url = result0;
        return packet;
    }
}

export default ImageDownloadRequest;
