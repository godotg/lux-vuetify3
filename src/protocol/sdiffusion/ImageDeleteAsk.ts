import IByteBuffer from '../IByteBuffer';

class ImageDeleteAsk {
    realUrl: string = '';

    static PROTOCOL_ID: number = 347;

    protocolId(): number {
        return ImageDeleteAsk.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: ImageDeleteAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.realUrl);
    }

    static read(buffer: IByteBuffer): ImageDeleteAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ImageDeleteAsk();
        const result0 = buffer.readString();
        packet.realUrl = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ImageDeleteAsk;