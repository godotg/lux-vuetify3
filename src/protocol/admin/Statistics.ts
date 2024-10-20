import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';
import NewsStat from './NewsStat';


class Statistics {
    time: number = 0;
    v2raySwitch: number = 0;
    ips: number = 0;
    active: number = 0;
    newsRequest: number = 0;
    chatgptRequest: number = 0;
    midImagineRequest: number = 0;
    sdSimulateRequest: number = 0;
    navigation: number = 0;
    newsStat: NewsStat | null = null;
}

export class StatisticsRegistration implements IProtocolRegistration<Statistics> {
    protocolId(): number {
        return 10050;
    }

    write(buffer: IByteBuffer, packet: Statistics | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeInt(packet.active);
        buffer.writeInt(packet.chatgptRequest);
        buffer.writeInt(packet.ips);
        buffer.writeInt(packet.midImagineRequest);
        buffer.writeInt(packet.navigation);
        buffer.writeInt(packet.newsRequest);
        buffer.writePacket(packet.newsStat, 10051);
        buffer.writeInt(packet.sdSimulateRequest);
        buffer.writeLong(packet.time);
        buffer.writeInt(packet.v2raySwitch);
    }

    read(buffer: IByteBuffer): Statistics | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new Statistics();
        const result0 = buffer.readInt();
        packet.active = result0;
        const result1 = buffer.readInt();
        packet.chatgptRequest = result1;
        const result2 = buffer.readInt();
        packet.ips = result2;
        const result3 = buffer.readInt();
        packet.midImagineRequest = result3;
        const result4 = buffer.readInt();
        packet.navigation = result4;
        const result5 = buffer.readInt();
        packet.newsRequest = result5;
        const result6 = buffer.readPacket(10051);
        packet.newsStat = result6;
        const result7 = buffer.readInt();
        packet.sdSimulateRequest = result7;
        const result8 = buffer.readLong();
        packet.time = result8;
        const result9 = buffer.readInt();
        packet.v2raySwitch = result9;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default Statistics;