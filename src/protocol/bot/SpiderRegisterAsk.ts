import IByteBuffer from '../IByteBuffer';


class SpiderRegisterAsk {

    spider: number = 0;

    static PROTOCOL_ID: number = 1000;

    protocolId(): number {
        return SpiderRegisterAsk.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: SpiderRegisterAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeInt(packet.spider);
    }

    static read(buffer: IByteBuffer): SpiderRegisterAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new SpiderRegisterAsk();
        const result0 = buffer.readInt();
        packet.spider = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default SpiderRegisterAsk;
