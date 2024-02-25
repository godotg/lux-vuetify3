import IByteBuffer from '../IByteBuffer';


class Error {

    code: number = 0;
    message: string = '';

    static PROTOCOL_ID: number = 101;

    protocolId(): number {
        return Error.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: Error | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeInt(packet.code);
        buffer.writeString(packet.message);
    }

    static read(buffer: IByteBuffer): Error | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new Error();
        const result0 = buffer.readInt();
        packet.code = result0;
        const result1 = buffer.readString();
        packet.message = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default Error;
