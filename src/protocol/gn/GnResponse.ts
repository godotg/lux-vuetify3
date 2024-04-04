import IByteBuffer from '../IByteBuffer';
import GaiNian from './GaiNian';


class GnResponse {

    gns: Array<GaiNian> = [];
    hotNotice: string = '';

    static PROTOCOL_ID: number = 222;

    protocolId(): number {
        return GnResponse.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: GnResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacketList(packet.gns, 220);
        buffer.writeString(packet.hotNotice);
    }

    static read(buffer: IByteBuffer): GnResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new GnResponse();
        const list0 = buffer.readPacketList(220);
        packet.gns = list0;
        const result1 = buffer.readString();
        packet.hotNotice = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default GnResponse;
