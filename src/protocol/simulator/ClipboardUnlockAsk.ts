import IByteBuffer from '../IByteBuffer';


class ClipboardUnlockAsk {

    

    static PROTOCOL_ID: number = 1202;

    protocolId(): number {
        return ClipboardUnlockAsk.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: ClipboardUnlockAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
    }

    static read(buffer: IByteBuffer): ClipboardUnlockAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ClipboardUnlockAsk();
        
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ClipboardUnlockAsk;
