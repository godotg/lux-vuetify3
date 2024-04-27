import IByteBuffer from '../IByteBuffer';


class SpiderStatusAsk {

    message: string = '';

    static PROTOCOL_ID: number = 1021;

    protocolId(): number {
        return SpiderStatusAsk.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: SpiderStatusAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.message);
    }

    static read(buffer: IByteBuffer): SpiderStatusAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new SpiderStatusAsk();
        const result0 = buffer.readString();
        packet.message = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default SpiderStatusAsk;
