import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class ClientInfoRequest {
    platform: string = '';
}

export class ClientInfoRequestRegistration implements IProtocolRegistration<ClientInfoRequest> {
    protocolId(): number {
        return 10070;
    }

    write(buffer: IByteBuffer, packet: ClientInfoRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.platform);
    }

    read(buffer: IByteBuffer): ClientInfoRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ClientInfoRequest();
        const result0 = buffer.readString();
        packet.platform = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ClientInfoRequest;