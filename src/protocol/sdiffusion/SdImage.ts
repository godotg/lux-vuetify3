import IByteBuffer from '../IByteBuffer';


class SdImage {

    id: number = 0;
    imageUrl: string = '';
    imageUrlLow: string = '';
    imageUrlMiddle: string = '';
    imageUrlHigh: string = '';

    static PROTOCOL_ID: number = 344;

    protocolId(): number {
        return SdImage.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: SdImage | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.id);
        buffer.writeString(packet.imageUrl);
        buffer.writeString(packet.imageUrlHigh);
        buffer.writeString(packet.imageUrlLow);
        buffer.writeString(packet.imageUrlMiddle);
    }

    static read(buffer: IByteBuffer): SdImage | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new SdImage();
        const result0 = buffer.readLong();
        packet.id = result0;
        const result1 = buffer.readString();
        packet.imageUrl = result1;
        const result2 = buffer.readString();
        packet.imageUrlHigh = result2;
        const result3 = buffer.readString();
        packet.imageUrlLow = result3;
        const result4 = buffer.readString();
        packet.imageUrlMiddle = result4;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default SdImage;
