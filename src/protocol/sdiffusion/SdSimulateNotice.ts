import SdImage from './SdImage';


class SdSimulateNotice {

    nonce: number = 0;
    images: Array<fun.jiucai.common.packet.sdiffusion.SdImage> = [];

    static PROTOCOL_ID: number = 341;

    protocolId(): number {
        return SdSimulateNotice.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SdSimulateNotice | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacketList(packet.images, 344);
        buffer.writeLong(packet.nonce);
    }

    static read(buffer: any): SdSimulateNotice | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new SdSimulateNotice();
        const list0 = buffer.readPacketList(344);
        packet.images = list0;
        const result1 = buffer.readLong();
        packet.nonce = result1;
        return packet;
    }
}

export default SdSimulateNotice;
