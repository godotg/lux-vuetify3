import SignalAttachment from './SignalAttachment';


class GatewayAttachment {

    sid: number = 0;
    uid: number = 0;
    taskExecutorHash: number = 0;
    client: boolean = false;
    signalAttachment: SignalAttachment | null = null;

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
        buffer.writeInt(packet.taskExecutorHash);
        buffer.writeLong(packet.uid);
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
        const result3 = buffer.readInt();
        packet.taskExecutorHash = result3;
        const result4 = buffer.readLong();
        packet.uid = result4;
        return packet;
    }
}

export default GatewayAttachment;
