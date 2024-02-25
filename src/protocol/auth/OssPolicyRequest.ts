import IByteBuffer from '../IByteBuffer';


class OssPolicyRequest {

    type: number = 0;

    static PROTOCOL_ID: number = 252;

    protocolId(): number {
        return OssPolicyRequest.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: OssPolicyRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeInt(packet.type);
    }

    static read(buffer: IByteBuffer): OssPolicyRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new OssPolicyRequest();
        const result0 = buffer.readInt();
        packet.type = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default OssPolicyRequest;
