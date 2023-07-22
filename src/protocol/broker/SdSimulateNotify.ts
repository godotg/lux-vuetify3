import SdSimulateNotice from '../sdiffusion/SdSimulateNotice';


class SdSimulateNotify {

    noticeSid: number = 0;
    notice: SdSimulateNotice | null = null;

    static PROTOCOL_ID: number = 309;

    protocolId(): number {
        return SdSimulateNotify.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SdSimulateNotify | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacket(packet.notice, 341);
        buffer.writeLong(packet.noticeSid);
    }

    static read(buffer: any): SdSimulateNotify | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new SdSimulateNotify();
        const result0 = buffer.readPacket(341);
        packet.notice = result0;
        const result1 = buffer.readLong();
        packet.noticeSid = result1;
        return packet;
    }
}

export default SdSimulateNotify;
