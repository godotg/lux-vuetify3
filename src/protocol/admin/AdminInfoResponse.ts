import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';
import Broadcast from './Broadcast';
import SystemStatics from './SystemStatics';


class AdminInfoResponse {
    broadcasts: Array<Broadcast> = [];
    statics: Array<SystemStatics> = [];
}

export class AdminInfoResponseRegistration implements IProtocolRegistration<AdminInfoResponse> {
    protocolId(): number {
        return 10001;
    }

    write(buffer: IByteBuffer, packet: AdminInfoResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacketList(packet.broadcasts, 10002);
        buffer.writePacketList(packet.statics, 10050);
    }

    read(buffer: IByteBuffer): AdminInfoResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new AdminInfoResponse();
        const list0 = buffer.readPacketList(10002);
        packet.broadcasts = list0;
        const list1 = buffer.readPacketList(10050);
        packet.statics = list1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default AdminInfoResponse;