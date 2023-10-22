

class ImageDownloadRequest {

    url: string = '';

    static PROTOCOL_ID: number = 345;

    protocolId(): number {
        return ImageDownloadRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: ImageDownloadRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.url);
    }

    static read(buffer: any): ImageDownloadRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ImageDownloadRequest();
        const result0 = buffer.readString();
        packet.url = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ImageDownloadRequest;
