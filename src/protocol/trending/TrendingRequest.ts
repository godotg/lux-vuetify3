import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class TrendingRequest {
    
}

export class TrendingRequestRegistration implements IProtocolRegistration<TrendingRequest> {
    protocolId(): number {
        return 425;
    }

    write(buffer: IByteBuffer, packet: TrendingRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
    }

    read(buffer: IByteBuffer): TrendingRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new TrendingRequest();
        
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default TrendingRequest;