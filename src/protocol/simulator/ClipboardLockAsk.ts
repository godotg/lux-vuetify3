import IByteBuffer from '../IByteBuffer';


class ClipboardLockAsk {

    

    static PROTOCOL_ID: number = 1200;

    protocolId(): number {
        return ClipboardLockAsk.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: ClipboardLockAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
    }

    static read(buffer: IByteBuffer): ClipboardLockAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ClipboardLockAsk();
        
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ClipboardLockAsk;
