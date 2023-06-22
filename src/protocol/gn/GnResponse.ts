import GaiNian from './GaiNian';


class GnResponse {

    gns: Array<fun.jiucai.common.packet.gn.GaiNian> = [];

    static PROTOCOL_ID: number = 222;

    protocolId(): number {
        return GnResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: GnResponse | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacketList(packet.gns, 220);
    }

    static read(buffer: any): GnResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new GnResponse();
        const list0 = buffer.readPacketList(220);
        packet.gns = list0;
        return packet;
    }
}

export default GnResponse;
