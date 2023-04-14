

class GatewaySynchronizeSidAsk {

    gatewayHostAndPort: string = '';
    sidMap: Map<number, number> | null = null;

    static PROTOCOL_ID: number = 24

    protocolId(): number {
        return GatewaySynchronizeSidAsk.PROTOCOL_ID;
    }

    static write(buffer: any, packet: GatewaySynchronizeSidAsk | null) {
        if (buffer.writePacketFlag(packet)) {
            return;
        }
        if (packet === null) {
            return;
        }

        buffer.writeString(packet.gatewayHostAndPort);
        buffer.writeLongLongMap(packet.sidMap);
    }

    static read(buffer: any): GatewaySynchronizeSidAsk | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new GatewaySynchronizeSidAsk();
        const result0 = buffer.readString();
        packet.gatewayHostAndPort = result0;
        const map1 = buffer.readLongLongMap();
        packet.sidMap = map1;
        return packet;
    }
}

export default GatewaySynchronizeSidAsk;
