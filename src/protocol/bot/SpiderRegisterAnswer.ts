import IByteBuffer from '../IByteBuffer';


class SpiderRegisterAnswer {

    

    static PROTOCOL_ID: number = 1001;

    protocolId(): number {
        return SpiderRegisterAnswer.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: SpiderRegisterAnswer | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
    }

    static read(buffer: IByteBuffer): SpiderRegisterAnswer | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new SpiderRegisterAnswer();
        
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default SpiderRegisterAnswer;
