import IByteBuffer from '../IByteBuffer';

class GnRequest {
    num: number = 0;

    static PROTOCOL_ID: number = 221;

    protocolId(): number {
        return GnRequest.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: GnRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeInt(packet.num);
    }

    static read(buffer: IByteBuffer): GnRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new GnRequest();
        const result0 = buffer.readInt();
        packet.num = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default GnRequest;