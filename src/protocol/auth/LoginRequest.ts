import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class LoginRequest {
    newsId: number = 0;
    chatMessageId: number = 0;
    token: string = '';
}

export class LoginRequestRegistration implements IProtocolRegistration<LoginRequest> {
    protocolId(): number {
        return 250;
    }

    write(buffer: IByteBuffer, packet: LoginRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        const beforeWriteIndex = buffer.getWriteOffset();
        buffer.writeInt(33);
        buffer.writeLong(packet.chatMessageId);
        buffer.writeLong(packet.newsId);
        buffer.writeString(packet.token);
        buffer.adjustPadding(33, beforeWriteIndex);
    }

    read(buffer: IByteBuffer): LoginRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new LoginRequest();
        const result0 = buffer.readLong();
        packet.chatMessageId = result0;
        const result1 = buffer.readLong();
        packet.newsId = result1;
        if (buffer.compatibleRead(beforeReadIndex, length)) {
            const result2 = buffer.readString();
            packet.token = result2;
        }
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default LoginRequest;