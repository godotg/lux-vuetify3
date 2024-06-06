import IByteBuffer from '../IByteBuffer';

class SdSimulateResponse {
    nonce: number = 0;
    costTime: number = 0;
    enPrompt: string = '';

    static PROTOCOL_ID: number = 343;

    protocolId(): number {
        return SdSimulateResponse.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: SdSimulateResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.costTime);
        buffer.writeString(packet.enPrompt);
        buffer.writeLong(packet.nonce);
    }

    static read(buffer: IByteBuffer): SdSimulateResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new SdSimulateResponse();
        const result0 = buffer.readLong();
        packet.costTime = result0;
        const result1 = buffer.readString();
        packet.enPrompt = result1;
        const result2 = buffer.readLong();
        packet.nonce = result2;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default SdSimulateResponse;