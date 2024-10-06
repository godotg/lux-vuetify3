import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';
import GaiNian from './GaiNian';


class GnResponse {
    gns: Array<GaiNian> = [];
    hotNotice: string = '';
}

export class GnResponseRegistration implements IProtocolRegistration<GnResponse> {
    protocolId(): number {
        return 222;
    }

    write(buffer: IByteBuffer, packet: GnResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacketList(packet.gns, 220);
        buffer.writeString(packet.hotNotice);
    }

    read(buffer: IByteBuffer): GnResponse | null {
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