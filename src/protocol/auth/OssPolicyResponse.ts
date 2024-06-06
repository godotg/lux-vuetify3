import IByteBuffer from '../IByteBuffer';
import OssPolicyVO from './OssPolicyVO';

class OssPolicyResponse {
    ossPolicy: OssPolicyVO | null = null;

    static PROTOCOL_ID: number = 253;

    protocolId(): number {
        return OssPolicyResponse.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: OssPolicyResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacket(packet.ossPolicy, 254);
    }

    static read(buffer: IByteBuffer): OssPolicyResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new OssPolicyResponse();
        const result0 = buffer.readPacket(254);
        packet.ossPolicy = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default OssPolicyResponse;