import SignalAttachment from '../attachment/SignalAttachment';
import SdSimulateRequest from '../sdiffusion/SdSimulateRequest';


class SdSimulateAsk {

    requestSid: number = 0;
    request: SdSimulateRequest | null = null;
    attachment: SignalAttachment | null = null;

    static PROTOCOL_ID: number = 307;

    protocolId(): number {
        return SdSimulateAsk.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SdSimulateAsk | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacket(packet.attachment, 0);
        buffer.writePacket(packet.request, 340);
        buffer.writeLong(packet.requestSid);
    }

    static read(buffer: any): SdSimulateAsk | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new SdSimulateAsk();
        const result0 = buffer.readPacket(0);
        packet.attachment = result0;
        const result1 = buffer.readPacket(340);
        packet.request = result1;
        const result2 = buffer.readLong();
        packet.requestSid = result2;
        return packet;
    }
}

export default SdSimulateAsk;
