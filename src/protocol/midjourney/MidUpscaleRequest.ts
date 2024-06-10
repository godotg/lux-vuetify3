import IByteBuffer from '../IByteBuffer';

class MidUpscaleRequest {
    category: string = '';
    nonce: string = '';
    midjourneyId: number = 0;

    static PROTOCOL_ID: number = 275;

    protocolId(): number {
        return MidUpscaleRequest.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: MidUpscaleRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.category);
        buffer.writeLong(packet.midjourneyId);
        buffer.writeString(packet.nonce);
    }

    static read(buffer: IByteBuffer): MidUpscaleRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MidUpscaleRequest();
        const result0 = buffer.readString();
        packet.category = result0;
        const result1 = buffer.readLong();
        packet.midjourneyId = result1;
        const result2 = buffer.readString();
        packet.nonce = result2;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default MidUpscaleRequest;