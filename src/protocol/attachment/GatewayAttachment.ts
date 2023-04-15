import SignalAttachment from './SignalAttachment';
import SignalOnlyAttachment from './SignalOnlyAttachment';


class GatewayAttachment {

    sid: number = 0;
    uid: number = 0;
    useTaskExecutorHashParam: boolean = false;
    taskExecutorHashParam: number = 0;
    client: boolean = false;
    signalAttachment: SignalAttachment | null = null;
    signalOnlyAttachment: SignalOnlyAttachment | null = null;

    static PROTOCOL_ID: number = 2;

    protocolId(): number {
        return GatewayAttachment.PROTOCOL_ID;
    }

    static write(buffer: any, packet: GatewayAttachment | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeBoolean(packet.client);
        buffer.writeLong(packet.sid);
        buffer.writePacket(packet.signalAttachment, 0);
        buffer.writePacket(packet.signalOnlyAttachment, 1);
        buffer.writeInt(packet.taskExecutorHashParam);
        buffer.writeLong(packet.uid);
        buffer.writeBoolean(packet.useTaskExecutorHashParam);
    }

    static read(buffer: any): GatewayAttachment | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new GatewayAttachment();
        const result0 = buffer.readBoolean(); 
        packet.client = result0;
        const result1 = buffer.readLong();
        packet.sid = result1;
        const result2 = buffer.readPacket(0);
        packet.signalAttachment = result2;
        const result3 = buffer.readPacket(1);
        packet.signalOnlyAttachment = result3;
        const result4 = buffer.readInt();
        packet.taskExecutorHashParam = result4;
        const result5 = buffer.readLong();
        packet.uid = result5;
        const result6 = buffer.readBoolean(); 
        packet.useTaskExecutorHashParam = result6;
        return packet;
    }
}

export default GatewayAttachment;
