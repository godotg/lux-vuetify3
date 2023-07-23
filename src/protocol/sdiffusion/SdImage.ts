

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

    static write(buffer: any, packet: SdImage | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.id);
        buffer.writeString(packet.imageUrl);
        buffer.writeString(packet.imageUrlHigh);
        buffer.writeString(packet.imageUrlLow);
        buffer.writeString(packet.imageUrlMiddle);
    }

    static read(buffer: any): SdImage | null {
        if (!buffer.readBoolean()) {
            return null;
        }
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
        return packet;
    }
}

export default SdImage;
