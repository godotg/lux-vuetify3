

class SdImage {

    id: number = 0;
    url: string = '';

    static PROTOCOL_ID: number = 344;

    protocolId(): number {
        return SdImage.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SdImage | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.id);
        buffer.writeString(packet.url);
    }

    static read(buffer: any): SdImage | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new SdImage();
        const result0 = buffer.readLong();
        packet.id = result0;
        const result1 = buffer.readString();
        packet.url = result1;
        return packet;
    }
}

export default SdImage;
