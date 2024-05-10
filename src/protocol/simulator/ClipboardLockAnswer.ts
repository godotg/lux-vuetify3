import IByteBuffer from '../IByteBuffer';


class ClipboardLockAnswer {

    

    static PROTOCOL_ID: number = 1201;

    protocolId(): number {
        return ClipboardLockAnswer.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: ClipboardLockAnswer | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
    }

    static read(buffer: IByteBuffer): ClipboardLockAnswer | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ClipboardLockAnswer();
        
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ClipboardLockAnswer;
