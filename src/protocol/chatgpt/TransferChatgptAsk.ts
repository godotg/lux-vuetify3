import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';
import ChatgptMessage from './ChatgptMessage';


class TransferChatgptAsk {
    requestSid: number = 0;
    requestId: number = 0;
    chatAI: number = 0;
    messages: Array<ChatgptMessage> = [];
    characters: Map<number, string> = new Map();
    ignoreAIs: Set<number> = new Set();
}

export class TransferChatgptAskRegistration implements IProtocolRegistration<TransferChatgptAsk> {
    protocolId(): number {
        return 510;
    }

    write(buffer: IByteBuffer, packet: TransferChatgptAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeIntStringMap(packet.characters);
        buffer.writeInt(packet.chatAI);
        buffer.writeIntSet(packet.ignoreAIs);
        buffer.writePacketList(packet.messages, 504);
        buffer.writeLong(packet.requestId);
        buffer.writeLong(packet.requestSid);
    }

    read(buffer: IByteBuffer): TransferChatgptAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new TransferChatgptAsk();
        const map0 = buffer.readIntStringMap();
        packet.characters = map0;
        const result1 = buffer.readInt();
        packet.chatAI = result1;
        const set2 = buffer.readIntSet();
        packet.ignoreAIs = set2;
        const list3 = buffer.readPacketList(504);
        packet.messages = list3;
        const result4 = buffer.readLong();
        packet.requestId = result4;
        const result5 = buffer.readLong();
        packet.requestSid = result5;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default TransferChatgptAsk;